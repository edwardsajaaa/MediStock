package controllers

import (
	"math"
	"medistock/config"
	"medistock/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetAlerts(c *gin.Context) {
	var items []models.Item
	config.DB.Preload("Batches").Find(&items)

	lowStockItems := make([]gin.H, 0)
	expiringBatches := make([]gin.H, 0)
	expiredBatches := make([]gin.H, 0)

	now := time.Now()
	thresholdDate := now.AddDate(0, 3, 0) // 3 bulan ke depan

	for _, item := range items {
		totalQty := 0
		for _, batch := range item.Batches {
			totalQty += batch.CurrentQty

			if batch.CurrentQty > 0 {
				daysLeft := int(math.Ceil(batch.ExpiryDate.Sub(now).Hours() / 24))

				if batch.ExpiryDate.Before(now) {
					// Sudah expired
					expiredBatches = append(expiredBatches, gin.H{
						"item_id":      item.ID,
						"item_name":    item.Name,
						"sku":          item.Sku,
						"category":     item.Category,
						"batch_number": batch.BatchNumber,
						"quantity":     batch.CurrentQty,
						"expiry_date":  batch.ExpiryDate.Format("2006-01-02"),
						"days_left":    daysLeft,
						"severity":     "expired",
					})
				} else if batch.ExpiryDate.Before(thresholdDate) {
					// Mendekati kadaluwarsa
					severity := "warning"
					if daysLeft <= 30 {
						severity = "critical"
					}
					expiringBatches = append(expiringBatches, gin.H{
						"item_id":      item.ID,
						"item_name":    item.Name,
						"sku":          item.Sku,
						"category":     item.Category,
						"batch_number": batch.BatchNumber,
						"quantity":     batch.CurrentQty,
						"expiry_date":  batch.ExpiryDate.Format("2006-01-02"),
						"days_left":    daysLeft,
						"severity":     severity,
					})
				}
			}
		}

		if totalQty <= item.MinStock {
			severity := "warning"
			if totalQty == 0 {
				severity = "critical"
			} else if float64(totalQty) <= float64(item.MinStock)*0.5 {
				severity = "critical"
			}

			lowStockItems = append(lowStockItems, gin.H{
				"item_id":     item.ID,
				"item_name":   item.Name,
				"sku":         item.Sku,
				"category":    item.Category,
				"current_qty": totalQty,
				"min_stock":   item.MinStock,
				"severity":    severity,
			})
		}
	}

	c.JSON(http.StatusOK, gin.H{
		"low_stock": lowStockItems,
		"expiring":  expiringBatches,
		"expired":   expiredBatches,
		"summary": gin.H{
			"low_stock_count": len(lowStockItems),
			"expiring_count":  len(expiringBatches),
			"expired_count":   len(expiredBatches),
		},
	})
}
