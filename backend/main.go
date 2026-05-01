package main

import (
	"log"
	"medistock/config"
	"medistock/routes"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("File .env backend tidak ditemukan, memakai environment yang sudah ada")
	}
	if os.Getenv("DATABASE_URL") == "" {
		log.Println("DATABASE_URL belum diisi, backend akan fallback ke SQLite")
	}

	// Koneksi ke database: Supabase/Postgres jika env tersedia, fallback ke SQLite untuk lokal.
	config.ConnectDB()

	// Inisialisasi Gin
	r := gin.Default()

	// Enable CORS
	r.Use(CORSMiddleware())

	// Ping Endpoint untuk test health
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(200, gin.H{"message": "pong"})
	})

	// Register Routes API
	routes.SetupRoutes(r)

	// Listen and serve
	log.Println("Server berjalan di http://0.0.0.0:8080")
	r.Run(":8080") 
}
