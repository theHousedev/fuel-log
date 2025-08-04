package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Println("Starting fuel-log database server...")

	db, err := NewDatabase()
	if err != nil {
		log.Fatal("Failed to create database:", err)
	}
	defer db.Close()
	fmt.Println("Database initialized.")

	http.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		w.Header().Set("Content-Type", "application/json")
		fmt.Fprintf(w, `{"status": "OK", "message": "Server is running!", "database": "UP"}`)
	})

	http.HandleFunc("/api/entries", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == "GET" {
			entries, err := db.GetAllEntries()
			if err != nil {
				fmt.Printf("Database error: %v\n", err)
				http.Error(w, "Database error", http.StatusInternalServerError)
				return
			}

			fmt.Printf("Found %d entries\n", len(entries))

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{
				"success": true,
				"data":    entries,
			})
		} else if r.Method == "POST" {
			fmt.Println("Post request initiated...")

			var data map[string]interface{}
			if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
				fmt.Printf("JSON error: %v\n", err)
				http.Error(w, "Invalid JSON", http.StatusBadRequest)
				return
			}

			fmt.Printf("Received data: %+v\n", data)

			id, err := db.AddEntry(data)
			if err != nil {
				fmt.Printf("Entry post failed; error: %v\n", err)
				http.Error(w, "Failed to post entry", http.StatusInternalServerError)
				return
			}

			fmt.Printf("Added entry; ID: %d\n", id)

			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusCreated)
			json.NewEncoder(w).Encode(map[string]interface{}{
				"success": true,
				"message": "Entry post successful.",
				"id":      id,
			})
		} else if r.Method == "DELETE" {
			id := r.URL.Query().Get("id")
			if id == "" {
				http.Error(w, "Missing ID parameter", http.StatusBadRequest)
				return
			}

			fmt.Printf("Deleting record with ID: %s\n", id)

			err := db.DeleteEntry(id)
			if err != nil {
				fmt.Printf("Delete error: %v\n", err)
				http.Error(w, "Failed to delete record", http.StatusInternalServerError)
				return
			}

			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(map[string]interface{}{
				"success": true,
				"message": fmt.Sprintf("Record %v deleted", id),
			})
		}
	})

	log.Fatal(http.ListenAndServe(":5000", nil))
}
