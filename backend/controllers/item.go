package controllers

import (
	"medistock/config"
	"medistock/models"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func parsePaging(c *gin.Context, defaultLimit int) (page int, limit int, offset int) {
	page = 1
	limit = defaultLimit

	if rawPage := c.Query("page"); rawPage != "" {
		if parsed, err := strconv.Atoi(rawPage); err == nil && parsed > 0 {
			page = parsed
		}
	}

	if rawLimit := c.Query("limit"); rawLimit != "" {
		if parsed, err := strconv.Atoi(rawLimit); err == nil && parsed > 0 {
			if parsed > 100 {
				parsed = 100
			}
			limit = parsed
		}
	}

	offset = (page - 1) * limit
	return page, limit, offset
}

func GetItems(c *gin.Context) {
	var items []models.Item
	page, limit, offset := parsePaging(c, 20)
	
	// Preload batches untuk menghitung stok total per item secara gampang (walau bisa di query spesifik)
	if err := config.DB.Preload("Batches").Order("created_at DESC").Limit(limit).Offset(offset).Find(&items).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data"})
		return
	}

	// Format response to include total stock calculated from active batches
	type ItemResponse struct {
		models.Item
		TotalStock int `json:"total_stock"`
	}

	var response []ItemResponse
	for _, item := range items {
		total := 0
		for _, batch := range item.Batches {
			total += batch.CurrentQty
		}
		
		res := ItemResponse{Item: item, TotalStock: total}
		res.Batches = nil // Sembunyikan per-batch list kalau ga butuh ditarik semua di list utama
		response = append(response, res)
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  response,
		"page":  page,
		"limit": limit,
	})
}

func GetItemByID(c *gin.Context) {
	id := c.Param("id")
	var item models.Item

	if err := config.DB.Preload("Batches").First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item tidak ditemukan"})
		return
	}

	c.JSON(http.StatusOK, item)
}

func CreateItem(c *gin.Context) {
	var item models.Item
	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Create(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan item"})
		return
	}

	c.JSON(http.StatusCreated, item)
}

func UpdateItem(c *gin.Context) {
	id := c.Param("id")
	var item models.Item

	if err := config.DB.First(&item, id).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Item tidak ditemukan"})
		return
	}

	if err := c.ShouldBindJSON(&item); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := config.DB.Save(&item).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update item"})
		return
	}

	c.JSON(http.StatusOK, item)
}

func DeleteItem(c *gin.Context) {
	id := c.Param("id")
	if err := config.DB.Delete(&models.Item{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghapus item"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Item berhasil dihapus"})
}
