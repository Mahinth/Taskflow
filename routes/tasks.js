const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET /api/tasks — Retrieve all tasks (newest first)
router.get('/', async (req, res) => {
    try {
        const tasks = await Task.find().sort({ createdAt: -1 });
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch tasks', error: err.message });
    }
});

// POST /api/tasks — Create a new task
router.post('/', async (req, res) => {
    try {
        const { title } = req.body;
        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Task title is required' });
        }
        const task = new Task({ title: title.trim() });
        const savedTask = await task.save();
        res.status(201).json(savedTask);
    } catch (err) {
        res.status(500).json({ message: 'Failed to create task', error: err.message });
    }
});

// PUT /api/tasks/:id — Update a task (title and/or completed)
router.put('/:id', async (req, res) => {
    try {
        const { title, completed } = req.body;
        const updateData = {};
        if (title !== undefined) updateData.title = title.trim();
        if (completed !== undefined) updateData.completed = completed;

        const task = await Task.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true,
        });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (err) {
        res.status(500).json({ message: 'Failed to update task', error: err.message });
    }
});

// DELETE /api/tasks/:id — Delete a task
router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json({ message: 'Task deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Failed to delete task', error: err.message });
    }
});

module.exports = router;
