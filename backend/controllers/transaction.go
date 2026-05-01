package controllers

import (
	"log"
	"medistock/config"
	"medistock/models"
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

type TransactionRequest struct {
	Type        string `json:"type"` // "IN" atau "OUT"
	TotalAmount float64 `json:"total_amount"`
	Notes       string `json:"notes"`
	Items       []TransactionItemReq `json:"items"`
}

type TransactionItemReq struct {
	ItemID      uint    `json:"item_id"`
	Qty         int     `json:"qty"`
	Price       float64 `json:"price"`
	// Untuk "IN": butuh mendaftarkan batch baru
	BatchNumber string  `json:"batch_number,omitempty"`
	ExpiryDate  string  `json:"expiry_date,omitempty"` // format: "2006-01-02"
}

func CreateTransaction(c *gin.Context) {
	var req TransactionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data salah"})
		return
	}

	tx := config.DB.Begin()

	trx := models.Transaction{
		Type:        req.Type,
		Date:        time.Now(),
		TotalAmount: req.TotalAmount,
		Notes:       req.Notes,
	}

	if err := tx.Create(&trx).Error; err != nil {
		tx.Rollback()
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mencatat transaksi"})
		return
	}

	if req.Type == "IN" {
		for _, item := range req.Items {
			// Parse expiry date
			layout := "2006-01-02"
			expiry, err := time.Parse(layout, item.ExpiryDate)
			if err != nil {
				tx.Rollback()
				c.JSON(http.StatusBadRequest, gin.H{"error": "Format tanggal kadaluarsa salah untuk item ID " + string(rune(item.ItemID))})
				return
			}
			
			// Validasi item exist
			var it models.Item
			if err := tx.First(&it, item.ItemID).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusBadRequest, gin.H{"error": "Item tidak ditemukan"})
				return
			}

			// Buat batch baru
			batch := models.Batch{
				ItemID:      item.ItemID,
				BatchNumber: item.BatchNumber,
				ExpiryDate:  expiry,
				InitialQty:  item.Qty,
				CurrentQty:  item.Qty,
			}
			if err := tx.Create(&batch).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan batch"})
				return
			}

			// Catat TransactionItem
			trxItem := models.TransactionItem{
				TransactionID: trx.ID,
				ItemID:        item.ItemID,
				BatchID:       batch.ID,
				Qty:           item.Qty,
				Price:         item.Price,
			}
			if err := tx.Create(&trxItem).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mencatat detail transaksi masukan"})
				return
			}
		}

	} else if req.Type == "OUT" {
		for _, itemReq := range req.Items {
			var totalDibutuhkan = itemReq.Qty

			// Ambil batch dari item_id diurutkan berdasarkan ExpiryDate terdekat (FEFO) dan stock > 0
			var batches []models.Batch
			if err := tx.Where("item_id = ? AND current_qty > 0", itemReq.ItemID).Order("expiry_date ASC").Find(&batches).Error; err != nil {
				tx.Rollback()
				c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengecek stok batch"})
				return
			}

			totalTersedia := 0
			for _, b := range batches {
				totalTersedia += b.CurrentQty
			}

			if totalDibutuhkan > totalTersedia {
				tx.Rollback()
				c.JSON(http.StatusBadRequest, gin.H{"error": "Stok tidak cukup untuk barang "}) 
				// Di dunia nyata, tampilkan nama barang
				return
			}

			// Logic potong stok dari batch untuk FEFO
			for _, batch := range batches {
				if totalDibutuhkan <= 0 {
					break
				}
				
				diambil := 0
				if batch.CurrentQty >= totalDibutuhkan {
					diambil = totalDibutuhkan
					batch.CurrentQty -= totalDibutuhkan
					totalDibutuhkan = 0
				} else {
					diambil = batch.CurrentQty
					totalDibutuhkan -= batch.CurrentQty
					batch.CurrentQty = 0
				}

				if err := tx.Save(&batch).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal update stok batch"})
					return
				}

				// Catat TransactionItem untuk setiap batch yang dipotong
				trxItem := models.TransactionItem{
					TransactionID: trx.ID,
					ItemID:        itemReq.ItemID,
					BatchID:       batch.ID,
					Qty:           diambil, // Nilai positif untuk record, tapi tau ini trans "OUT" dari header
					Price:         itemReq.Price, // Harga ambil dari req atau hitung
				}
				if err := tx.Create(&trxItem).Error; err != nil {
					tx.Rollback()
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mencatat detail mutasi pengurangan"})
					return
				}
			}
		}
	} else {
		tx.Rollback()
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tipe transaksi harus IN atau OUT"})
		return
	}

	tx.Commit()
	c.JSON(http.StatusOK, gin.H{"message": "Transaksi berhasil disimpan", "transaction_id": trx.ID})
}

// Untuk laporan Ledger / Kartu Stok
func GetLedger(c *gin.Context) {
	var trx []models.Transaction
	page := 1
	limit := 20

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
	// Preload nested associations
	if err := config.DB.Preload("Items.Item").Preload("Items.Batch").Order("date DESC").Limit(limit).Offset((page-1)*limit).Find(&trx).Error; err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menarik data histori mutasi"})
		return
	}

	c.JSON(http.StatusOK, trx)
}
