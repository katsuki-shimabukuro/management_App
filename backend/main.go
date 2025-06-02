package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	_ "github.com/mattn/go-sqlite3"

	_ "github.com/katsuki-shimabukuro/management_App/backend/docs" // ← ここは go mod init したモジュール名に置き換えてください

	echoSwagger "github.com/swaggo/echo-swagger"
)

// @title Task API
// @version 1.0
// @description This is a simple task management API.
// @host localhost:8080
// @BasePath /api

// Task represents a task item in the system
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

	// Create table if not exists
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

	// Middleware
	e.Use(middleware.Logger())
	e.Use(middleware.Recover())
	e.Use(middleware.CORS())

	// Swagger
	e.GET("/swagger/*", echoSwagger.WrapHandler)

	// Routes
	api := e.Group("/api")
	api.GET("/tasks", getTasks)
	api.POST("/tasks", createTask)
	api.DELETE("/tasks/:id", deleteTask)
	api.PATCH("/tasks/:id", updateTask)

	// Start server
	e.Logger.Fatal(e.Start(":8080"))
}

// getTasks godoc
// @Summary Get all tasks
// @Description Get a list of all tasks
// @Tags tasks
// @Produce json
// @Success 200 {array} Task
// @Failure 500 {string} string
// @Router /tasks [get]
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

// createTask godoc
// @Summary Create a new task
// @Description Add a new task with title, lesson number, and note
// @Tags tasks
// @Accept json
// @Produce json
// @Param task body Task true "Task to create"
// @Success 201 {object} map[string]string
// @Failure 400 {string} string
// @Failure 500 {string} string
// @Router /tasks [post]
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

// deleteTask godoc
// @Summary Delete a task
// @Description Delete a task by ID
// @Tags tasks
// @Param id path int true "Task ID"
// @Success 204
// @Failure 500 {string} string
// @Router /tasks/{id} [delete]
func deleteTask(c echo.Context) error {
	id := c.Param("id")
	_, err := db.Exec("DELETE FROM tasks WHERE id = ?", id)
	if err != nil {
		return c.String(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}

// updateTask godoc
// @Summary Update a task
// @Description Update task fields such as is_done or deadline
// @Tags tasks
// @Accept json
// @Param id path int true "Task ID"
// @Param task body map[string]interface{} true "Fields to update"
// @Success 204
// @Failure 400 {string} string
// @Failure 500 {string} string
// @Router /tasks/{id} [patch]
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
