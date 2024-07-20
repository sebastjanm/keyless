const express = require('express');
const pool = require('./db');
const router = express.Router();

// Fetch all locations
router.get('/locations', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM locations');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching locations:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
