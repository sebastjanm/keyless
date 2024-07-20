const express = require('express');
const { pool } = require('./db');
const router = express.Router();

// Fetch distinct filter options from the database
router.get('/filters', async (req, res) => {
    try {
        const filters = {};

        // Fetch distinct vehicle types from car categories
        const vehicleTypesResult = await pool.query('SELECT DISTINCT category_type FROM car_categories');
        filters.vehicleType = vehicleTypesResult.rows.map(row => row.category_type);
        console.log('Fetched vehicle types:', filters.vehicleType);

        // Fetch distinct manufacturers (brands)
        const makesResult = await pool.query('SELECT DISTINCT manufacturer FROM car_models');
        filters.brand = makesResult.rows.map(row => row.manufacturer);
        console.log('Fetched brands:', filters.brand);

        // Fetch fuel types from enum
        const fuelTypesResult = await pool.query('SELECT unnest(enum_range(NULL::fuel_type)) AS fuel_type');
        filters.fuel = fuelTypesResult.rows.map(row => row.fuel_type);
        console.log('Fetched fuel types:', filters.fuel);

        // Fetch transmission types from enum
        const transmissionsResult = await pool.query('SELECT unnest(enum_range(NULL::transmission_type)) AS transmission');
        filters.transmission = transmissionsResult.rows.map(row => row.transmission);
        console.log('Fetched transmissions:', filters.transmission);

        // Fetch drive train types from enum
        const driveTrainsResult = await pool.query('SELECT unnest(enum_range(NULL::drive_type)) AS drive_train');
        filters.driveTrain = driveTrainsResult.rows.map(row => row.drive_train);
        console.log('Fetched drive trains:', filters.driveTrain);

        // Fetch distinct number of seats
        const seatsResult = await pool.query('SELECT DISTINCT seats FROM car_models');
        filters.numberOfSeats = seatsResult.rows.map(row => row.seats.toString());
        console.log('Fetched number of seats:', filters.numberOfSeats);

        res.json(filters);
    } catch (err) {
        console.error('Error fetching filters:', err);
        res.status(500).json({ error: 'Error fetching filters. Please try again later.' });
    }
});

module.exports = router;
