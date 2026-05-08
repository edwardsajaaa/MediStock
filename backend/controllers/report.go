package controllers

import (
	"fmt"
	"medistock/config"
	"medistock/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetDashboardStats(c *gin.Context) {
	// 1. Total Jenis Barang
	var totalItems int64
	config.DB.Model(&models.Item{}).Count(&totalItems)

	// 2. Transaksi Hari Ini
	var todayTrx int64
	startOfDay := time.Now().Truncate(24 * time.Hour)
	config.DB.Model(&models.Transaction{}).Where("date >= ?", startOfDay).Count(&todayTrx)

	// 3. Low Stock Alerts & Expiry Alerts
	var items []models.Item
	config.DB.Preload("Batches").Find(&items)

	lowStockCount := 0
	expiringCount := 0
	lowStockItems := make([]gin.H, 0)
	expiringBatches := make([]gin.H, 0)

	thresholdDate := time.Now().AddDate(0, 3, 0) // Expiry dalam 3 bulan

	for _, item := range items {
		totalQty := 0
		for _, batch := range item.Batches {
			totalQty += batch.CurrentQty
			
			// Cek Expiry yang quantity nya masih ada
			if batch.CurrentQty > 0 && batch.ExpiryDate.Before(thresholdDate) {
				expiringCount++
				expiringBatches = append(expiringBatches, gin.H{
					"item_name": item.Name,
					"batch_number": batch.BatchNumber,
					"quantity": batch.CurrentQty,
					"expiry_date": batch.ExpiryDate.Format("2006-01-02"),
				})
			}
		}

		if totalQty <= item.MinStock {
			lowStockCount++
			lowStockItems = append(lowStockItems, gin.H{
				"item_name": item.Name,
				"current_qty": totalQty,
				"min_stock": item.MinStock,
			})
		}
	}

	// ====== CHART DATA ======

	// --- Tren Stok Masuk & Keluar (Januari - Desember tahun ini) ---
	currentYear := time.Now().Year()
	monthLabels := []string{"Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"}

	seriesIn := make([]float64, 12)
	seriesOut := make([]float64, 12)

	type MonthlySum struct {
		Month int
		Total float64
	}

	var monthlyIn []MonthlySum
	config.DB.Model(&models.Transaction{}).
		Select("CAST(strftime('%m', date) AS INTEGER) as month, COALESCE(SUM(total_amount), 0) as total").
		Where("type = 'IN' AND strftime('%Y', date) = ?", fmt.Sprintf("%d", currentYear)).
		Group("month").
		Scan(&monthlyIn)

	for _, m := range monthlyIn {
		if m.Month >= 1 && m.Month <= 12 {
			seriesIn[m.Month-1] = m.Total
		}
	}

	var monthlyOut []MonthlySum
	config.DB.Model(&models.Transaction{}).
		Select("CAST(strftime('%m', date) AS INTEGER) as month, COALESCE(SUM(total_amount), 0) as total").
		Where("type = 'OUT' AND strftime('%Y', date) = ?", fmt.Sprintf("%d", currentYear)).
		Group("month").
		Scan(&monthlyOut)

	for _, m := range monthlyOut {
		if m.Month >= 1 && m.Month <= 12 {
			seriesOut[m.Month-1] = m.Total
		}
	}

	var totalIn, totalOut float64
	for _, v := range seriesIn {
		totalIn += v
	}
	for _, v := range seriesOut {
		totalOut += v
	}

	// --- Distribusi Kategori (jumlah item per kategori) ---
	type CategoryCount struct {
		Category string
		Count    int
	}
	var catDist []CategoryCount
	config.DB.Model(&models.Item{}).
		Select("category, COUNT(*) as count").
		Group("category").
		Order("count DESC").
		Scan(&catDist)

	catDistResult := make([]gin.H, 0)
	for _, cd := range catDist {
		catDistResult = append(catDistResult, gin.H{
			"category": cd.Category,
			"count":    cd.Count,
		})
	}

	// --- Stok Per Kategori (untuk radar chart) ---
	type CategoryStock struct {
		Category   string
		TotalStock int
	}
	var catStock []CategoryStock
	config.DB.Model(&models.Batch{}).
		Select("items.category as category, COALESCE(SUM(batches.current_qty), 0) as total_stock").
		Joins("JOIN items ON items.id = batches.item_id").
		Where("items.deleted_at IS NULL AND batches.deleted_at IS NULL").
		Group("items.category").
		Order("total_stock DESC").
		Scan(&catStock)

	catStockResult := make([]gin.H, 0)
	for _, cs := range catStock {
		catStockResult = append(catStockResult, gin.H{
			"category":    cs.Category,
			"total_stock": cs.TotalStock,
		})
	}

	// --- Top Supplier / Sumber Barang Masuk (berdasarkan notes transaksi IN) ---
	type SupplierContrib struct {
		Notes      string
		TotalValue float64
	}
	var topSuppliers []SupplierContrib
	config.DB.Model(&models.Transaction{}).
		Select("COALESCE(notes, 'Tidak diketahui') as notes, COALESCE(SUM(total_amount), 0) as total_value").
		Where("type = 'IN' AND notes IS NOT NULL AND notes != ''").
		Group("notes").
		Order("total_value DESC").
		Limit(5).
		Scan(&topSuppliers)

	topSuppliersResult := make([]gin.H, 0)
	for _, ts := range topSuppliers {
		topSuppliersResult = append(topSuppliersResult, gin.H{
			"notes":       ts.Notes,
			"total_value": ts.TotalValue,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"metrics": gin.H{
			"total_items": totalItems,
			"today_transactions": todayTrx,
			"low_stock_count": lowStockCount,
			"expiring_count": expiringCount,
		},
		"alerts": gin.H{
			"low_stock": lowStockItems,
			"expiring": expiringBatches,
		},
		"charts": gin.H{
			"stock_trend": gin.H{
				"labels":    monthLabels,
				"series_in":  seriesIn,
				"series_out": seriesOut,
				"total_in":   totalIn,
				"total_out":  totalOut,
				"year":       currentYear,
			},
			"category_distribution": catDistResult,
			"category_stock":        catStockResult,
			"top_suppliers":         topSuppliersResult,
		},
	})
}
