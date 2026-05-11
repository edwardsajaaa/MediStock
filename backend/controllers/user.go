package controllers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
)

func getSupabaseConfig() (string, string) {
	url := os.Getenv("SUPABASE_URL")
	key := os.Getenv("SUPABASE_SERVICE_ROLE_KEY")
	return url, key
}

func GetUsers(c *gin.Context) {
	url, key := getSupabaseConfig()
	if url == "" || key == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Konfigurasi Supabase belum lengkap (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)"})
		return
	}

	req, err := http.NewRequest("GET", url+"/auth/v1/admin/users?per_page=100", nil)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat request"})
		return
	}

	req.Header.Set("Authorization", "Bearer "+key)
	req.Header.Set("apikey", key)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghubungi Supabase: " + err.Error()})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": "Supabase error", "detail": string(body)})
		return
	}

	var result map[string]interface{}
	json.Unmarshal(body, &result)

	users, ok := result["users"].([]interface{})
	if !ok {
		c.JSON(http.StatusOK, gin.H{"users": []interface{}{}})
		return
	}

	var cleanUsers []gin.H
	for _, u := range users {
		user, ok := u.(map[string]interface{})
		if !ok {
			continue
		}

		metadata, _ := user["user_metadata"].(map[string]interface{})
		role := ""
		fullName := ""
		if metadata != nil {
			if r, ok := metadata["role"].(string); ok {
				role = r
			}
			if n, ok := metadata["full_name"].(string); ok {
				fullName = n
			}
		}

		cleanUsers = append(cleanUsers, gin.H{
			"id":              user["id"],
			"email":           user["email"],
			"role":            role,
			"full_name":       fullName,
			"created_at":      user["created_at"],
			"last_sign_in_at": user["last_sign_in_at"],
		})
	}

	c.JSON(http.StatusOK, gin.H{"users": cleanUsers})
}

func UpdateUserRole(c *gin.Context) {
	userID := c.Param("id")
	url, key := getSupabaseConfig()
	if url == "" || key == "" {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Konfigurasi Supabase belum lengkap"})
		return
	}

	var input struct {
		Role string `json:"role"`
	}
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Role wajib diisi"})
		return
	}

	payload := fmt.Sprintf(`{"user_metadata": {"role": "%s"}}`, input.Role)

	req, err := http.NewRequest("PUT", url+"/auth/v1/admin/users/"+userID, bytes.NewBufferString(payload))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membuat request"})
		return
	}

	req.Header.Set("Authorization", "Bearer "+key)
	req.Header.Set("apikey", key)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menghubungi Supabase"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		c.JSON(resp.StatusCode, gin.H{"error": "Gagal update role", "detail": string(body)})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Role berhasil diperbarui"})
}
