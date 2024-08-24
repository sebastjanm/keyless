import pkg from 'pg';
import config from '../config.js';

const { Pool } = pkg;
const pool = new Pool(config.db);

export async function getFilters(req, res) {
    try {
        const client = await pool.connect();

        // Updated queries to match the new schema
        const queries = {
            brands: 'SELECT DISTINCT manufacturer FROM car_models',
            models: 'SELECT DISTINCT model_name FROM car_models',
            fuelTypes: `
                SELECT DISTINCT ft.fuel_type_name 
                FROM fuel_types ft 
                JOIN car_models cm ON ft.fuel_type_id = cm.fuel_type_id
            `,
            vehicleTypes: `
                SELECT DISTINCT vt.vehicle_type_name 
                FROM vehicle_types vt 
                JOIN car_models cm ON vt.vehicle_type_id = cm.vehicle_type_id
            `,
            transmissions: `
                SELECT DISTINCT tt.transmission_name 
                FROM transmission_types tt 
                JOIN car_models cm ON tt.transmission_type_id = cm.transmission_type_id
            `,
            driveTrains: `
                SELECT DISTINCT dt.drive_type_name 
                FROM drive_types dt 
                JOIN car_models cm ON dt.drive_type_id = cm.drive_type_id
            `,
            seats: 'SELECT DISTINCT seats FROM car_models',
            colors: `
                SELECT DISTINCT col.color_name AS color
                FROM cars c
                JOIN colors col ON c.color_id = col.color_id
            `,
            availability: `
                SELECT DISTINCT st.status_name 
                FROM car_status_types st 
                JOIN cars c ON st.status_id = c.status_id
            `,
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
