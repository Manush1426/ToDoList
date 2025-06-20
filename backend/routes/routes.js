const router = require('express').Router();
const Task = require('../models/model');

// Create a new task
router.post('/tasks', async (req, res) => {
    try {
        const {text} = req.body;

        const task = await Task.create({text});

        res.status(200).json(task);
    } 
    
    catch (error) {
        res.status(400).json({error : error.message});
    }
});

// Get all tasks
router.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        res.status(500).json({error : error.message});
    }
});

// Get a single task by ID
router.get('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a task by ID
router.put('/tasks/:id', async (req, res) => {
    try {
        const { text, isCompleted } = req.body;
        const task = await Task.findByIdAndUpdate(
            req.params.id,
            { text, isCompleted },
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// Delete a task by ID
router.delete('/tasks/:id', async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ message: 'Task deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;