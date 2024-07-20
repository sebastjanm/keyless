const express = require('express');
const { pool } = require('./db');
const router = express.Router();

// Helper function to convert filter values to correct data type
function convertFilterValue(value, type) {
    if (type === 'integer') {
        return value.map(v => parseInt(v, 10));
    }
    if (type === 'string') {
        return value;
    }
    return value;
}

// Fetch cars based on filters
router.get('/cars', async (req, res) => {
    try {
        const filters = req.query;
        let query = `
            SELECT cm.*, c.status
            FROM car_models cm
            JOIN cars c ON cm.model_id = c.model_id
            WHERE 1=1
        `;
        const queryParams = [];
        let paramIndex = 1; // SQL parameters index

        // Apply filters based on the query parameters
        if (filters.vehicleType) {
            const vehicleTypes = convertFilterValue(filters.vehicleType.split(','), 'string');
            queryParams.push(vehicleTypes);
            query += ` AND cm.category_id IN (
                SELECT category_id FROM car_categories WHERE category_type = ANY ($${paramIndex++})::text[]
            )`;
        }

        if (filters.brand) {
            const brands = convertFilterValue(filters.brand.split(','), 'string');
            queryParams.push(brands);
            query += ` AND cm.manufacturer = ANY ($${paramIndex++})::text[]`;
        }

        if (filters.fuel) {
            const fuelTypes = convertFilterValue(filters.fuel.split(','), 'string');
            queryParams.push(fuelTypes);
            query += ` AND cm.fuel_type = ANY ($${paramIndex++})::fuel_type[]`;
        }

        if (filters.transmission) {
            const transmissions = convertFilterValue(filters.transmission.split(','), 'string');
            queryParams.push(transmissions);
            query += ` AND cm.transmission = ANY ($${paramIndex++})::transmission_type[]`;
        }

        if (filters.driveTrain) {
            const driveTrains = convertFilterValue(filters.driveTrain.split(','), 'string');
            queryParams.push(driveTrains);
            query += ` AND cm.drive = ANY ($${paramIndex++})::drive_type[]`;
        }

        if (filters.numberOfSeats) {
            const numberOfSeats = convertFilterValue(filters.numberOfSeats.split(','), 'integer');
            queryParams.push(numberOfSeats);
            query += ` AND cm.seats = ANY ($${paramIndex++})::int[]`;
        }

        console.log('Executing query:', query);
        console.log('With parameters:', queryParams);

        const result = await pool.query(query, queryParams);
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching cars:', err);
        res.status(500).json({ error: 'Error fetching cars. Please try again later.' });
    }
});

// Fetch car details by model ID
router.get('/cars/:model_id', async (req, res) => {
    const modelId = req.params.model_id;
    try {
        const result = await pool.query('SELECT * FROM car_models WHERE model_id = $1', [modelId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error fetching car details:', err);
        res.status(500).json({ error: 'Error fetching car details. Please try again later.' });
    }
});

module.exports = router;
