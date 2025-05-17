package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/mattn/go-sqlite3"
)

type Task struct {
	ID           int     `json:"id"`
	TitleNumber  string  `json:"title_number"`
	OnlyTitle    string  `json:"only_title"`
	LessonNumber int     `json:"lesson_number"`
	Note         string  `json:"note"`
	IsDone       bool    `json:"is_done"`
	Deadline     *string `json:"deadline,omitempty"`
}

var db *sql.DB

func main() {
	var err error
	db, err = sql.Open("sqlite3", "./data/app.db")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// テーブル作成
	sqlStmt := `
	CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
		title_number TEXT,
		only_title TEXT,
		lesson_number INTEGER,
		note TEXT,
		is_done BOOLEAN DEFAULT 0,
		deadline TEXT
	);`
	if _, err := db.Exec(sqlStmt); err != nil {
		log.Fatal(err)
	}

	e := echo.New()

	// ミドルウェア
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// エンドポイント定義
	e.GET("/api/tasks", getTasks)
	e.POST("/api/tasks", createTask)
	e.DELETE("/api/tasks/:id", deleteTask)
	e.PATCH("/api/tasks/:id", updateTask)

	// サーバ起動
	e.Logger.Fatal(e.Start(":8080"))
}

// GET /api/tasks
func getTasks(c echo.Context) error {
	rows, err := db.Query("SELECT id, title_number, only_title, lesson_number, note, is_done, deadline FROM tasks ORDER BY deadline IS NULL, deadline ASC, lesson_number ASC")
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		var deadline sql.NullString
		err := rows.Scan(&t.ID, &t.TitleNumber, &t.OnlyTitle, &t.LessonNumber, &t.Note, &t.IsDone, &deadline)
		if err != nil {
			return c.String(http.StatusInternalServerError, err.Error())
		}
		if deadline.Valid {
			t.Deadline = &deadline.String
		}
		tasks = append(tasks, t)
	}
	return c.JSON(http.StatusOK, tasks)
}

// POST /api/tasks
func createTask(c echo.Context) error {
	var t Task
	if err := c.Bind(&t); err != nil {
		return c.String(http.StatusBadRequest, "Invalid JSON")
	}
	if t.TitleNumber == "" {
		return c.String(http.StatusBadRequest, "title_number is required")
	}

	_, err := db.Exec("INSERT INTO tasks (title_number, only_title, lesson_number, note, is_done) VALUES (?, ?, ?, ?, ?)",
		t.TitleNumber, t.OnlyTitle, t.LessonNumber, t.Note, false)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusCreated, map[string]string{"message": "Task added"})
}

// DELETE /api/tasks/:id
func deleteTask(c echo.Context) error {
	id := c.Param("id")
	_, err := db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}

// PATCH /api/tasks/:id
func updateTask(c echo.Context) error {
	id := c.Param("id")
	var body map[string]interface{}
	if err := json.NewDecoder(c.Request().Body).Decode(&body); err != nil {
		return c.String(http.StatusBadRequest, "Invalid JSON")
	}

	if isDone, ok := body["is_done"]; ok {
		_, err := db.Exec("UPDATE tasks SET is_done = ? WHERE id = ?", isDone, id)
		if err != nil {
			return c.String(http.StatusInternalServerError, err.Error())
		}
	}
	if deadline, ok := body["deadline"]; ok {
		_, err := db.Exec("UPDATE tasks SET deadline = ? WHERE id = ?", deadline, id)
		if err != nil {
			return c.String(http.StatusInternalServerError, err.Error())
		}
	}
	return c.NoContent(http.StatusNoContent)
}
