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
		title TEXT,
		is_done BOOLEAN DEFAULT 0
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
			rows, err := db.Query("SELECT id, title, is_done FROM tasks")
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			defer rows.Close()

			var tasks []map[string]interface{}
			for rows.Next() {
				var id int
				var title string
				var isDone bool
				rows.Scan(&id, &title, &isDone)
				tasks = append(tasks, map[string]interface{}{"id": id, "title": title, "is_done": isDone})
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

			_, err := db.Exec("INSERT INTO tasks (title, is_done) VALUES (?, ?)", title, false)
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}

			json.NewEncoder(w).Encode(map[string]string{"message": "Task added"})
		}
	})

	http.HandleFunc("/api/tasks/", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "DELETE, PATCH")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type", "application/json")

		id := r.URL.Path[len("/api/tasks/"):]

		if r.Method == http.MethodDelete {
			// 削除処理(DELETE)
			_, err := db.Exec("DELETE FROM tasks WHERE id = (?)", id)
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}

			w.WriteHeader(http.StatusNoContent)
		} else if r.Method == http.MethodPatch {
			// checkboxの状態更新(Patch)
			var body map[string]bool
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				http.Error(w, "Invalid JSON", 400)
				return
			}
			isDone := body["is_done"]
			_, err := db.Exec("UPDATE tasks SET is_done = ? WHERE id = ?", isDone, id)
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			w.WriteHeader(http.StatusNoContent)
		}
	})

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
