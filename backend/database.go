package main

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
)

type Database struct {
	db *sql.DB
}

func NewDatabase() (*Database, error) {
	db, err := sql.Open("sqlite3", "./fuel_log.db")
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}
	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	createTableSQL := `
        CREATE TABLE IF NOT EXISTS entries (
            id INTEGER PRIMARY KEY,
            date TEXT NOT NULL,
            odo INTEGER NOT NULL,
            trip REAL NOT NULL,
            gallons REAL NOT NULL,
            pricePerGal REAL NOT NULL,
            cost REAL NOT NULL,
            mpg REAL NOT NULL,
            cpm REAL NOT NULL,
            notes TEXT
        )
    `

	_, err = db.Exec(createTableSQL)
	if err != nil {
		return nil, fmt.Errorf("failed to create table: %w", err)
	}

	return &Database{db: db}, nil
}

func (d *Database) Close() error {
	return d.db.Close()
}

func (d *Database) GetAllEntries() ([]map[string]interface{}, error) {
	query := `SELECT id, date, odo, trip, gallons, pricePerGal, cost, mpg, cpm, notes 
              FROM entries ORDER BY odo DESC`
	rows, err := d.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var entries []map[string]interface{}
	for rows.Next() {
		var id int
		var date, notes string
		var odo int
		var trip, gallons, pricePerGal, cost, mpg, cpm float64

		err := rows.Scan(&id, &date, &odo, &trip, &gallons, &pricePerGal, &cost, &mpg, &cpm, &notes)
		if err != nil {
			return nil, err
		}

		entry := map[string]interface{}{
			"id": id, "date": date, "odo": odo, "trip": trip,
			"gallons": gallons, "pricePerGal": pricePerGal,
			"cost": cost, "mpg": mpg, "cpm": cpm, "notes": notes,
		}
		entries = append(entries, entry)
	}

	return entries, nil
}

func (d *Database) AddEntry(data map[string]interface{}) (int, error) {
	query := `
        INSERT INTO entries (date, odo, trip, gallons, pricePerGal, cost, mpg, cpm, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

	result, err := d.db.Exec(query,
		data["date"], data["odo"], data["trip"], data["gallons"],
		data["pricePerGal"], data["cost"], data["mpg"], data["cpm"], data["notes"],
	)
	if err != nil {
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(id), nil
}

func (d *Database) DeleteEntry(id string) error {
	query := `DELETE FROM entries WHERE id = ?`
	_, err := d.db.Exec(query, id)
	return err
}
