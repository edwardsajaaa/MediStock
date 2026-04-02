package models

import (
	"time"

	"gorm.io/gorm"
)

type Item struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	Name      string         `gorm:"not null" json:"name"`
	Category  string         `gorm:"not null" json:"category"` // Obat Bebas, Obat Resep, Alkes
	Sku       string         `gorm:"uniqueIndex" json:"sku"`
	MinStock  int            `json:"min_stock"` // Untuk Low Stock Alert
	BasePrice float64        `json:"base_price"`
	SellPrice float64        `json:"sell_price"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Batches []Batch `json:"batches,omitempty"`
}

type Batch struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	ItemID      uint           `gorm:"index" json:"item_id"`
	Item        Item           `gorm:"foreignKey:ItemID" json:"item,omitempty"`
	BatchNumber string         `gorm:"not null" json:"batch_number"`
	ExpiryDate  time.Time      `gorm:"not null" json:"expiry_date"` // Untuk Expiry Alert & FEFO
	InitialQty  int            `gorm:"not null" json:"initial_qty"`
	CurrentQty  int            `gorm:"not null" json:"current_qty"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`
}

type Transaction struct {
	ID          uint           `gorm:"primaryKey" json:"id"`
	Type        string         `gorm:"not null" json:"type"` // "IN" atau "OUT"
	Date        time.Time      `gorm:"not null" json:"date"`
	TotalAmount float64        `json:"total_amount"`
	Notes       string         `json:"notes"`
	CreatedAt   time.Time      `json:"created_at"`
	UpdatedAt   time.Time      `json:"updated_at"`
	DeletedAt   gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Items []TransactionItem `json:"items,omitempty"`
}

type TransactionItem struct {
	ID            uint           `gorm:"primaryKey" json:"id"`
	TransactionID uint           `gorm:"index" json:"transaction_id"`
	ItemID        uint           `gorm:"index" json:"item_id"`
	Item          *Item          `gorm:"foreignKey:ItemID" json:"item,omitempty"`
	BatchID       uint           `gorm:"index" json:"batch_id"`
	Batch         *Batch         `gorm:"foreignKey:BatchID" json:"batch,omitempty"`
	Qty           int            `gorm:"not null" json:"qty"`
	Price         float64        `gorm:"not null" json:"price"` // Harga saat transaksi
	CreatedAt     time.Time      `json:"created_at"`
	UpdatedAt     time.Time      `json:"updated_at"`
	DeletedAt     gorm.DeletedAt `gorm:"index" json:"-"`
}
