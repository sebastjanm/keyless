import pkg from 'pg';
import config from '../config.js';

const { Pool } = pkg;
const pool = new Pool(config.db);

// getPopularCars

export async function getPopularCars(req, res) {
    try {
        const client = await pool.connect();
        const query = `
            SELECT 
                c.car_id, 
                cm.model_name, 
                cm.manufacturer, 
                p.monthly_payment AS price, 
                c.mileage, 
                col.color_name,
                ft.fuel_type_name,
                tt.transmission_name,
                dt.drive_type_name,
                cm.seats, 
                cs.status_name
            FROM cars c
            JOIN car_models cm ON c.model_id = cm.model_id
            LEFT JOIN car_pricing cp ON c.car_id = cp.car_id
            LEFT JOIN pricing p ON cp.pricing_id = p.pricing_id
            LEFT JOIN colors col ON c.color_id = col.color_id
            LEFT JOIN fuel_types ft ON cm.fuel_type_id = ft.fuel_type_id
            LEFT JOIN transmission_types tt ON cm.transmission_type_id = tt.transmission_type_id
            LEFT JOIN drive_types dt ON cm.drive_type_id = dt.drive_type_id
            LEFT JOIN car_status_types cs ON c.status_id = cs.status_id
            WHERE p.monthly_payment IS NOT NULL
            ORDER BY p.monthly_payment DESC
            LIMIT 4;
        `;
        const result = await client.query(query);
        res.json(result.rows);
        client.release();
    } catch (err) {
        console.error('Error fetching popular cars:', err);
        res.status(500).json({ error: 'Database query failed' });
    }
}


// getCars
export async function getCars(req, res) {
    const { brand, vehicleType, fuel, transmission, drive, color, availability, limit } = req.query;

    try {
        const client = await pool.connect();
        let query = `
            SELECT c.car_id, cm.model_name, cm.manufacturer, p.monthly_payment AS price, c.mileage, col.color_name,
                   ft.fuel_type_name, tt.transmission_name, dt.drive_type_name, cm.seats, cs.status_name
            FROM cars c
            JOIN car_models cm ON c.model_id = cm.model_id
            LEFT JOIN car_pricing cp ON c.car_id = cp.car_id
            LEFT JOIN pricing p ON cp.pricing_id = p.pricing_id
            LEFT JOIN colors col ON c.color_id = col.color_id
            LEFT JOIN fuel_types ft ON cm.fuel_type_id = ft.fuel_type_id
            LEFT JOIN transmission_types tt ON cm.transmission_type_id = tt.transmission_type_id
            LEFT JOIN drive_types dt ON cm.drive_type_id = dt.drive_type_id
            LEFT JOIN car_status_types cs ON c.status_id = cs.status_id
            WHERE 1=1
        `;

        const params = [];

        if (brand) {
            params.push(brand);
            query += ` AND cm.manufacturer = $${params.length}`;
        }
        if (vehicleType) {
            params.push(vehicleType);
            query += ` AND cm.vehicle_type_id = (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = $${params.length})`;
        }
        if (fuel) {
            params.push(fuel);
            query += ` AND cm.fuel_type_id = (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = $${params.length})`;
        }
        if (transmission) {
            params.push(transmission);
            query += ` AND cm.transmission_type_id = (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = $${params.length})`;
        }
        if (drive) {
            params.push(drive);
            query += ` AND cm.drive_type_id = (SELECT drive_type_id FROM drive_types WHERE drive_type_name = $${params.length})`;
        }
        if (color) {
            params.push(color);
            query += ` AND col.color_name = $${params.length}`;
        }
        if (availability) {
            params.push(availability);
            query += ` AND cs.status_name = $${params.length}`;
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



//getCarDetails

// Example endpoint: /api/car-details/:carId
export async function getCarDetails(req, res) {
    const carId = req.params.carId;

    try {
        const client = await pool.connect();

        const carDetailsQuery = `
            SELECT 
                c.car_id, cm.model_name, cm.manufacturer, p.monthly_payment, c.mileage, col.color_name,
                ft.fuel_type_name, tt.transmission_name, dt.drive_type_name, cm.seats, cs.status_name,
                p.administration_fee, p.deposit, p.insurance_package, p.mileage_plan, p.monthly_payment
            FROM cars c
            JOIN car_models cm ON c.model_id = cm.model_id
            LEFT JOIN car_pricing cp ON c.car_id = cp.car_id
            LEFT JOIN pricing p ON cp.pricing_id = p.pricing_id
            LEFT JOIN colors col ON c.color_id = col.color_id
            LEFT JOIN fuel_types ft ON cm.fuel_type_id = ft.fuel_type_id
            LEFT JOIN transmission_types tt ON cm.transmission_type_id = tt.transmission_type_id
            LEFT JOIN drive_types dt ON cm.drive_type_id = dt.drive_type_id
            LEFT JOIN car_status_types cs ON c.status_id = cs.status_id
            WHERE c.car_id = $1;
        `;

        const result = await client.query(carDetailsQuery, [carId]);
        const car = result.rows[0];

        const carImagesQuery = `SELECT image_url FROM car_model_images WHERE model_id = $1;`;
        const imagesResult = await client.query(carImagesQuery, [car.model_id]);

        car.images = imagesResult.rows.map(row => row.image_url);

        res.json(car);
        client.release();
    } catch (error) {
        console.error('Error fetching car details:', error);
        res.status(500).json({ error: 'Database query failed' });
    }
}

