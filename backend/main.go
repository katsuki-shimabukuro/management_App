package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func main() {
	db, err := sql.Open("sqlite3", "./data/app.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// テーブル作成（初回だけ実行される）
	sqlStmt := `
	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		title_number TEXT,
		only_title Text,
		lesson_number INTEGER,
		note TEXT,
		is_done BOOLEAN DEFAULT 0,
		deadline TEXT
	);`
	_, err = db.Exec(sqlStmt)
	if err != nil {
		log.Fatal(err)
	}

	// APIエンドポイント（GET: 取得, POST: 追加）
	http.HandleFunc("/api/tasks", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(&w)

		// プリフライトリクエストへの対応
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		if r.Method == http.MethodGet {
			// 一覧取得(GET)
			rows, err := db.Query("SELECT id, title_number, only_title, lesson_number, note, is_done, deadline FROM tasks ORDER BY deadline IS NULL, deadline ASC, lesson_number ASC")
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}
			defer rows.Close()

			var tasks []map[string]interface{}
			for rows.Next() {
				var id int
				var title_number, only_title, note, deadline sql.NullString
				var lessonNumber int
				var isDone bool
				rows.Scan(&id, &title_number, &only_title, &lessonNumber, &note, &isDone, &deadline)
				task := map[string]interface{}{
					"id":            id,
					"title_number":  title_number.String,
					"only_title":    only_title.String,
					"lesson_number": lessonNumber,
					"note":          note.String,
					"is_done":       isDone,
				}
				if deadline.Valid {
					task["deadline"] = deadline.String
				}
				tasks = append(tasks, task)
			}
			json.NewEncoder(w).Encode(tasks)

		} else if r.Method == http.MethodPost {
			// 追加処理(POST)
			var task map[string]interface{}
			if err := json.NewDecoder(r.Body).Decode(&task); err != nil {
				http.Error(w, "Invalid JSON", 400)
				return
			}

			title_number := task["title_number"].(string)
			only_title := task["only_title"].(string)
			lessonNumber := int(task["lesson_number"].(float64))
			note := task["note"].(string)
			if title_number == "" {
				http.Error(w, "title is required", 400)
				return
			}

			_, err := db.Exec("INSERT INTO tasks (title_number, only_title, lesson_number, note, is_done) VALUES (?, ?, ?, ?, ?)", title_number, only_title, lessonNumber, note, false)
			if err != nil {
				http.Error(w, err.Error(), 500)
				return
			}

			json.NewEncoder(w).Encode(map[string]string{"message": "Task added"})
		}
	})

	http.HandleFunc("/api/tasks/", func(w http.ResponseWriter, r *http.Request) {
		enableCORS(&w)
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

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
			// 状態更新(Patch)
			var body map[string]interface{}
			if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
				http.Error(w, "Invalid JSON", 400)
				return
			}
			// checkboxの更新
			if isDone, ok := body["is_done"]; ok {
				_, err := db.Exec("UPDATE tasks SET is_done = ? WHERE id = ?", isDone, id)
				if err != nil {
					http.Error(w, err.Error(), 500)
					return
				}
			}
			// 期日の更新
			if deadline, ok := body["deadline"]; ok {
				_, err := db.Exec("UPDATE tasks SET deadline = ? WHERE id = ?", deadline, id)
				if err != nil {
					http.Error(w, err.Error(), 500)
					return
				}
			}

			w.WriteHeader(http.StatusNoContent)
		}
	})

	log.Println("Listening on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

// CORS設定
func enableCORS(w *http.ResponseWriter) {
	(*w).Header().Set("Access-Control-Allow-Origin", "*")
	(*w).Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, PATCH, OPTIONS")
	(*w).Header().Set("Access-Control-Allow-Headers", "Content-Type")
	(*w).Header().Set("Content-Type", "application/json")
}
