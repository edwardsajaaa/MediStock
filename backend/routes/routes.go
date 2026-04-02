package routes

import (
	"medistock/controllers"
	"github.com/gin-gonic/gin"
)

func SetupRoutes(r *gin.Engine) {
	api := r.Group("/api")
	
	// Master Data Items
	api.GET("/items", controllers.GetItems)
	api.GET("/items/:id", controllers.GetItemByID)
	api.POST("/items", controllers.CreateItem)
	api.PUT("/items/:id", controllers.UpdateItem)
	api.DELETE("/items/:id", controllers.DeleteItem)

	// Transactions (Inbound / Outbound / Ledger)
	api.POST("/transactions", controllers.CreateTransaction)
	api.GET("/ledger", controllers.GetLedger)

	// Dashboard & Alerts
	api.GET("/dashboard/stats", controllers.GetDashboardStats)
}
