package config

import (
	"log"
	"medistock/models"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	
	// Gunakan SQLite untuk development lokal yang terisolasi.
	// Mudah dipindah ke Postgres saat production dengan gorm.io/driver/postgres
	DB, err = gorm.Open(sqlite.Open("medistock.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal koneksi database: %v", err)
	}

	log.Println("Database terkoneksi (SQLite)...")

	// Automigrate
	err = DB.AutoMigrate(
		&models.Item{},
		&models.Batch{},
		&models.Transaction{},
		&models.TransactionItem{},
	)
	if err != nil {
		log.Fatalf("Gagal automigrate: %v", err)
	}

	log.Println("Migrasi tabel selesai.")
}
