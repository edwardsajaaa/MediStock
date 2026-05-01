package config

import (
	"fmt"
	"log"
	"medistock/models"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() {
	var err error
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		host := os.Getenv("SUPABASE_DB_HOST")
		port := os.Getenv("SUPABASE_DB_PORT")
		name := os.Getenv("SUPABASE_DB_NAME")
		user := os.Getenv("SUPABASE_DB_USER")
		password := os.Getenv("SUPABASE_DB_PASSWORD")

		if host != "" && port != "" && name != "" && user != "" && password != "" {
			dsn = fmt.Sprintf("host=%s port=%s user=%s password=%s dbname=%s sslmode=require TimeZone=Asia/Jakarta", host, port, user, password, name)
		}
	}

	if dsn != "" {
		DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
		if err != nil {
			log.Fatalf("Gagal koneksi database Supabase/Postgres: %v", err)
		}

		log.Println("Database terkoneksi (Supabase/Postgres)...")
	} else {
		// Fallback lokal untuk development bila env Supabase belum diisi.
		DB, err = gorm.Open(sqlite.Open("medistock.db"), &gorm.Config{})
		if err != nil {
			log.Fatalf("Gagal koneksi database: %v", err)
		}

		log.Println("Database terkoneksi (SQLite)...")
	}

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
