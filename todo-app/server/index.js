import pg from "pg";
import cors from "cors";
import express from "express";

const { Pool } = pg;

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "To-do",
  password: "Maina@123",
  port: "5432",
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.log('Error: ', err);
  } else {
    console.log('Database connected: ', res.rows);
  }
});

app.get("/tasks", async (req, res) => {
  const result = await pool.query("SELECT * FROM tasks");
  res.json(result.rows);
});

app.post("/tasks", async (req, res) => {
  const { text } = req.body;
  const result = await pool.query("INSERT INTO tasks (text) VALUES ($1) RETURNING *", [text]);
  res.json(result.rows[0]);
});

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const result = await pool.query("DELETE FROM tasks WHERE id = $1", [id]);
  res.json({ message: "Task deleted!" });
});

app.listen(5000, () => {
  console.log("Server running at http://localhost:5000");
});
