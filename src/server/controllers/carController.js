import pkg from 'pg';
import config from '../config.js';

const { Pool } = pkg;
const pool = new Pool(config.db);

export async function getCars(req, res) {
    const { brand, vehicleType, fuel, transmission, drive, color, availability, limit } = req.query;

    try {
        const client = await pool.connect();
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

        query += ' ORDER BY c.car_id DESC';

        if (limit) {
            params.push(parseInt(limit, 10));
            query += ` LIMIT $${params.length}`;
        }

        const result = await client.query(query, params);
        res.json(result.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching cars:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
}


export async function getCarDetails(req, res) {
    const { carId } = req.params;
    try {
        const client = await pool.connect();
        const query = `
            SELECT c.car_id, cm.*, c.status, p.monthly_payment AS price, p.extras AS reduced_price, c.mileage, cm.image, 
                   col.color_name AS color, c.description
            FROM cars c
            JOIN car_models cm ON c.model_id = cm.model_id
            LEFT JOIN car_pricing cp ON c.car_id = cp.car_id
            LEFT JOIN pricing p ON cp.pricing_id = p.pricing_id
            LEFT JOIN car_colors cc ON c.car_id = cc.car_id
            LEFT JOIN colors col ON cc.color_id = col.color_id
            WHERE c.car_id = $1
        `;
        const result = await client.query(query, [carId]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Car not found' });
        }
        res.json(result.rows[0]);
        client.release();
    } catch (err) {
        console.error('Error fetching car details:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
}



