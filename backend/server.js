const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// In-memory task storage
let tasks = [];

// Get all tasks
app.get("/tasks", (req, res) => {
    res.json(tasks);
});

// Add a task
app.post("/tasks", (req, res) => {
    const { name } = req.body;
    if(!name) return res.status(400).json({ error: "Task name is required" });
    const newTask = { id: Date.now(), name, completed: false };
    tasks.push(newTask);
    res.json(newTask);
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    tasks = tasks.filter(task => task.id != id);
    res.json({ message: "Task deleted" });
});

// Update task completed status
app.patch("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    const task = tasks.find(t => t.id == id);
    if(task){
        task.completed = completed;
        res.json(task);
    } else {
        res.status(404).json({ error: "Task not found" });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
