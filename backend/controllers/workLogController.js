// controllers/workLogController.js
const express = require('express');
const WorkLog = require('../models/workLog');

const router = express.Router();

// // Controller functions
router.get('/all', async (req, res) => {
    try {
        const logs = await WorkLog.find();
        res.json(logs);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.post('/add', async (req, res) => {
    try {
        const newLog = new WorkLog(req.body);
        await newLog.save();
        res.status(201).json(newLog);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const log = await WorkLog.findByIdAndDelete(req.params.id);

        if (!log) {
            return res.status(404).json({ message: 'Work log not found' });
        }

        res.status(200).json({ message: 'Work log deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;