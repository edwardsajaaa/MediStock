package controllers

import (
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
	})
}
