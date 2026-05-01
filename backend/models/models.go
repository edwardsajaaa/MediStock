package models

import (
	"time"

	"gorm.io/gorm"
)

type Item struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"not null;index" json:"name"`
	Category  string         `gorm:"not null;index" json:"category"` // Obat Bebas, Obat Resep, Alkes
	Sku       string         `gorm:"uniqueIndex" json:"sku"`
	MinStock  int            `json:"min_stock"` // Untuk Low Stock Alert
	BasePrice float64        `json:"base_price"`
	SellPrice float64        `json:"sell_price"`
	CreatedAt time.Time      `gorm:"index" json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Batches []Batch `json:"batches,omitempty"`
}

type Batch struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	ItemID      uint           `gorm:"index;index:idx_batch_item_expiry,priority:1" json:"item_id"`
	Item        Item           `gorm:"foreignKey:ItemID" json:"item,omitempty"`
	BatchNumber string         `gorm:"not null" json:"batch_number"`
	ExpiryDate  time.Time      `gorm:"not null;index;index:idx_batch_item_expiry,priority:2" json:"expiry_date"` // Untuk Expiry Alert & FEFO
	InitialQty  int            `gorm:"not null" json:"initial_qty"`
	CurrentQty  int            `gorm:"not null" json:"current_qty"`
	CreatedAt   time.Time      `gorm:"index" json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type Transaction struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Type        string         `gorm:"not null" json:"type"` // "IN" atau "OUT"
	Date        time.Time      `gorm:"not null;index" json:"date"`
	TotalAmount float64        `json:"total_amount"`
	Notes       string         `json:"notes"`
	CreatedAt   time.Time      `gorm:"index" json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Items []TransactionItem `json:"items,omitempty"`
}

type TransactionItem struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	TransactionID uint           `gorm:"index;index:idx_trx_item_batch,priority:1" json:"transaction_id"`
	ItemID        uint           `gorm:"index;index:idx_trx_item_batch,priority:2" json:"item_id"`
	Item          *Item          `gorm:"foreignKey:ItemID" json:"item,omitempty"`
	BatchID       uint           `gorm:"index;index:idx_trx_item_batch,priority:3" json:"batch_id"`
	Batch         *Batch         `gorm:"foreignKey:BatchID" json:"batch,omitempty"`
	Qty           int            `gorm:"not null" json:"qty"`
	Price         float64        `gorm:"not null" json:"price"` // Harga saat transaksi
	CreatedAt     time.Time      `gorm:"index" json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}
