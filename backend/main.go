package main

import (
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

func main() {
	// Koneksi ke Supabase PostgreSQL
	dsn := "host=YOUR_HOST user=YOUR_USER password=YOUR_PASSWORD dbname=YOUR_DB port=YOUR_PORT sslmode=disable"
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Gagal koneksi database: %v", err)
	}

	// Inisialisasi Gin
	r := gin.Default()

	// Contoh endpoint
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// TODO: Tambahkan routing dan logika bisnis sesuai fitur MediStock

	r.Run() // listen and serve on 0.0.0.0:8080
}
