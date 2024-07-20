const express = require('express');
const pool = require('./db');
const router = express.Router();

// Create a new subscription
router.post('/reserve', async (req, res) => {
    const { userId, modelId, contractLength, kmPerMonth, pickupLocation, dropoffLocation } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO subscriptions (user_id, car_id, config_id, start_date, end_date, monthly_mileage, additional_mileage_cost, total_mileage, total_cost, additional_cost_per_km, insurance_package, pickup_location_id, dropoff_location_id, rental_phase) VALUES ($1, $2, $3, NOW(), NOW() + INTERVAL $4 MONTH, $5, 0, 0, 0, 0, \'None\', $6, $7, \'Reserved\') RETURNING *',
            [userId, modelId, 1, contractLength, kmPerMonth, pickupLocation, dropoffLocation]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error creating reservation:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
