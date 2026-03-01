const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// In-memory task storage (resets on server restart)
let tasks = [];

// Generate a unique ID
function generateId() {
    return crypto.randomBytes(12).toString('hex');
}

// GET /api/tasks — Retrieve all tasks (newest first)
router.get('/', (req, res) => {
    const sorted = [...tasks].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    res.json(sorted);
});

// POST /api/tasks — Create a new task
router.post('/', (req, res) => {
    const { title } = req.body;
    if (!title || !title.trim()) {
        return res.status(400).json({ message: 'Task title is required' });
    }
    const task = {
        _id: generateId(),
        title: title.trim(),
        completed: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };
    tasks.push(task);
    res.status(201).json(task);
});

// PUT /api/tasks/:id — Update a task (title and/or completed)
router.put('/:id', (req, res) => {
    const { title, completed } = req.body;
    const idx = tasks.findIndex((t) => t._id === req.params.id);
    if (idx === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }
    if (title !== undefined) tasks[idx].title = title.trim();
    if (completed !== undefined) tasks[idx].completed = completed;
    tasks[idx].updatedAt = new Date().toISOString();
    res.json(tasks[idx]);
});

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', (req, res) => {
    const idx = tasks.findIndex((t) => t._id === req.params.id);
    if (idx === -1) {
        return res.status(404).json({ message: 'Task not found' });
    }
    tasks.splice(idx, 1);
    res.json({ message: 'Task deleted successfully' });
});

module.exports = router;
