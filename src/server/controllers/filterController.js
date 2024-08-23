import pkg from 'pg';
import config from '../config.js';

const { Pool } = pkg;
const pool = new Pool(config.db);

export async function getFilters(req, res) {
    try {
        const client = await pool.connect();
        const queries = {
            brands: 'SELECT DISTINCT manufacturer FROM car_models',
            models: 'SELECT DISTINCT model FROM car_models',
            fuelTypes: 'SELECT DISTINCT fuel_type FROM car_models',
            vehicleTypes: 'SELECT DISTINCT category_type FROM car_categories',
            transmissions: 'SELECT DISTINCT transmission FROM car_models',
            driveTrains: 'SELECT DISTINCT drive FROM car_models',
            seats: 'SELECT DISTINCT seats FROM car_models',
            colors: `
                SELECT DISTINCT col.color_name AS color
                FROM cars c
                LEFT JOIN car_colors cc ON c.car_id = cc.car_id
                LEFT JOIN colors col ON cc.color_id = col.color_id
            `,
            availability: 'SELECT DISTINCT status FROM cars',
        };

        const filterData = {};

        for (const [key, query] of Object.entries(queries)) {
            const result = await client.query(query);
            filterData[key] = result.rows.map(row => Object.values(row)[0]);
        }

        res.json(filterData);
        client.release();
    } catch (err) {
        console.error('Error fetching filters:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
}
