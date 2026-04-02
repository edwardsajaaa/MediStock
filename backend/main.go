package main

import (
	"log"
	"medistock/config"
	"medistock/routes"

	"github.com/gin-gonic/gin"
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
	// Koneksi ke DB SQLite (development)
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
