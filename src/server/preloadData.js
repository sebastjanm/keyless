// src/server/preloadData.js
import pkg from 'pg';
import config from './config.js';

const { Pool } = pkg;
const pool = new Pool(config.db);

let preloadedData = {};

async function preloadData() {
    try {
        const filters = await getFilters();
        preloadedData.filters = filters;

        const cars = await getCars({});
        preloadedData.cars = cars;

        console.log('Preloaded data:', preloadedData);
    } catch (err) {
        console.error('Error preloading data:', err);
    }
}

async function getFilters() {
    try {
        const brandsQuery = await pool.query('SELECT DISTINCT manufacturer FROM car_models');
        const modelsQuery = await pool.query('SELECT DISTINCT model FROM car_models');
        const fuelTypesQuery = await pool.query('SELECT DISTINCT fuel_type FROM car_models');
        const vehicleTypesQuery = await pool.query('SELECT DISTINCT category_type FROM car_categories');
        const transmissionsQuery = await pool.query('SELECT DISTINCT transmission FROM car_models');
        const driveTrainsQuery = await pool.query('SELECT DISTINCT drive FROM car_models');
        const seatsQuery = await pool.query('SELECT DISTINCT seats FROM car_models');
        const colorsQuery = await pool.query(`
            SELECT DISTINCT col.color_name AS color
            FROM cars c
            LEFT JOIN car_colors cc ON c.car_id = cc.car_id
            LEFT JOIN colors col ON cc.color_id = col.color_id
        `);
        const availabilityQuery = await pool.query('SELECT DISTINCT status FROM cars');

        return {
            brands: brandsQuery.rows.map(row => row.manufacturer),
            models: modelsQuery.rows.map(row => row.model),
            fuelTypes: fuelTypesQuery.rows.map(row => row.fuel_type),
            vehicleTypes: vehicleTypesQuery.rows.map(row => row.category_type),
            transmissions: transmissionsQuery.rows.map(row => row.transmission),
            driveTrains: driveTrainsQuery.rows.map(row => row.drive),
            seats: seatsQuery.rows.map(row => row.seats),
            colors: colorsQuery.rows.map(row => row.color),
            availability: availabilityQuery.rows.map(row => row.status),
        };
    } catch (err) {
        console.error('Error fetching filters:', err);
        throw new Error('Database query failed.');
    }
}

async function getCars(filters) {
    const { brand, vehicleType, fuel, transmission, drive, color, availability } = filters;
    let query = `
        SELECT c.car_id, cm.*, c.status, p.monthly_payment AS price, p.extras AS reduced_price, c.mileage, cm.image
        FROM car_models cm
        JOIN cars c ON cm.model_id = c.model_id
        LEFT JOIN car_pricing cp ON c.car_id = cp.car_id
        LEFT JOIN pricing p ON cp.pricing_id = p.pricing_id
        LEFT JOIN car_colors cc ON c.car_id = cc.car_id
        LEFT JOIN colors col ON cc.color_id = col.color_id
        WHERE 1=1
    `;
    const params = [];

    if (brand) {
        params.push(brand);
        query += ` AND cm.manufacturer = $${params.length}`;
    }
    if (vehicleType) {
        params.push(vehicleType);
        query += ` AND cm.category_id IN (SELECT category_id FROM car_categories WHERE category_type = $${params.length})`;
    }
    if (fuel) {
        params.push(fuel);
        query += ` AND cm.fuel_type = $${params.length}`;
    }
    if (transmission) {
        params.push(transmission);
        query += ` AND cm.transmission = $${params.length}`;
    }
    if (drive) {
        params.push(drive);
        query += ` AND cm.drive = $${params.length}`;
    }
    if (color) {
        params.push(color);
        query += ` AND col.color_name = $${params.length}`;
    }
    if (availability) {
        params.push(availability);
        query += ` AND c.status = $${params.length}`;
    }

    try {
        const result = await pool.query(query, params);
        return result.rows;
    } catch (err) {
        console.error('Error executing query:', err);
        throw new Error('Database query failed.');
    }
}

export { preloadData, preloadedData };
