package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "./app.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// テーブル作成（初回だけ実行される）
	sqlStmt := `
	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		title TEXT
	);`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Fatal(err)
	}

	// APIエンドポイント（GET: 取得, POST: 追加）
	http.HandleFunc("/api/tasks", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		// プリフライトリクエストへの対応
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == http.MethodGet {
			// 一覧取得(GET)
			rows, err := db.Query("SELECT id, title FROM tasks")
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			defer rows.Close()

			var tasks []map[string]interface{}
			for rows.Next() {
				var id int
				var title string
				rows.Scan(&id, &title)
				tasks = append(tasks, map[string]interface{}{"id": id, "title": title})
			}
			json.NewEncoder(w).Encode(tasks)

		} else if r.Method == http.MethodPost {
			// 追加処理(POST)
			var task map[string]string
			if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
				http.Error(w, "Invalid JSON", 400)
				return
			}

			title := task["title"]
			if title == "" {
				http.Error(w, "title is required", 400)
				return
			}

			_, err := db.Exec("INSERT INTO tasks (title) VALUES (?)", title)
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}

			json.NewEncoder(w).Encode(map[string]string{"message": "Task added"})
		}
	})

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
