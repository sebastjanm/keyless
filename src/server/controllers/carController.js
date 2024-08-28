// carController.js (ES Modules style)
import pkg from 'pg';
import config from '../config.js';

const { Pool } = pkg;
const pool = new Pool(config.db);


export async function getPopularCars(req, res) {
    let client;
    try {
        client = await pool.connect();

        // Initialize params as an empty array
        const params = [];

        const query = `
            SELECT 
                c.car_id, 
                cm.model_name, 
                cm.manufacturer, 
                COALESCE(p.monthly_payment, 0) AS price,
                c.mileage, 
                col.color_name,
                ft.fuel_type_name, 
                tt.transmission_name, 
                dt.drive_type_name, 
                cm.seats, 
                cs.status_name,
                cim.image_url
            FROM cars c
            JOIN car_models cm ON c.model_id = cm.model_id
            LEFT JOIN pricing p ON c.car_id = p.car_id AND p.default_pricing = TRUE
            LEFT JOIN colors col ON c.color_id = col.color_id
            LEFT JOIN fuel_types ft ON cm.fuel_type_id = ft.fuel_type_id
            LEFT JOIN transmission_types tt ON cm.transmission_type_id = tt.transmission_type_id
            LEFT JOIN drive_types dt ON cm.drive_type_id = dt.drive_type_id
            LEFT JOIN car_status_types cs ON c.status_id = cs.status_id
            LEFT JOIN (
                SELECT model_id, MIN(image_url) AS image_url
                FROM car_model_images
                GROUP BY model_id
            ) cim ON cm.model_id = cim.model_id
           LIMIT 4;
        `;

        // Execute the query with the params array (which is empty in this case)
        const result = await client.query(query, params);
        console.log('Popular cars fetched:', result.rows);  // Log the fetched data
        
        // Handle null prices as discussed before
        result.rows.forEach(car => {
            if (car.price === null) {
                console.log(`Missing price for car_id ${car.car_id}`);  // Log any issues
                car.price = 0;  // Set a default value if necessary
            }
        });

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching popular cars:', {
            message: err.message,
            stack: err.stack,
        });
        res.status(500).json({ error: 'Database query failed', details: err.message });
    } finally {
        if (client) {
            client.release(); // Ensure client release
        }
    }
}




export async function getCars(req, res) {
    const { brand, vehicleType, fuel, transmission, drive, color, availability, limit } = req.query;
    let client;

    try {
        client = await pool.connect();
        let query = `
            SELECT 
                c.car_id, 
                cm.model_name, 
                cm.manufacturer, 
                COALESCE(p.monthly_payment, 0) AS price,  -- Fetch the monthly payment, defaulting to 0 if not found
                p.deposit,  -- Include deposit from pricing table
                p.administration_fee,  -- Include administration fee from pricing table
                p.excess_mileage_fee,  -- Include excess mileage fee from pricing table
                COALESCE(sd.months, 0) AS subscription_duration,  -- Include subscription duration, default to 0 if not found
                COALESCE(ip.package_name, 'Standard') AS insurance_package_name,  -- Include insurance package name, default to 'Standard'
                COALESCE(mp.kilometers, 0) AS kilometers,  -- Include mileage plan kilometers, default to 0
                COALESCE(pt.package_name, 'Basic') AS package_type,  -- Include package type, default to 'Basic'
                c.mileage, 
                COALESCE(col.color_name, 'Unknown') AS color_name,  -- Default to 'Unknown' if no color is found
                COALESCE(ft.fuel_type_name, 'Not Specified') AS fuel_type_name,  -- Default to 'Not Specified' if no fuel type is found
                COALESCE(tt.transmission_name, 'Not Specified') AS transmission_name,  -- Default to 'Not Specified' if no transmission type is found
                COALESCE(dt.drive_type_name, 'Not Specified') AS drive_type_name,  -- Default to 'Not Specified' if no drive type is found
                cm.seats, 
                COALESCE(cs.status_name, 'Available') AS status_name,  -- Default to 'Available' if no status is found
                cim.image_url  -- Fetch the image URL from car_model_images
            FROM cars c
            JOIN car_models cm ON c.model_id = cm.model_id
            LEFT JOIN pricing p ON c.car_id = p.car_id AND p.default_pricing = TRUE  -- Join pricing table to get the default price and related details for the car
            LEFT JOIN subscription_durations sd ON p.duration_id = sd.duration_id  -- Join to get subscription duration
            LEFT JOIN insurance_packages ip ON p.insurance_package_id = ip.insurance_package_id  -- Join to get insurance package name
            LEFT JOIN mileage_plans mp ON p.mileage_plan_id = mp.plan_id  -- Join to get mileage plan kilometers
            LEFT JOIN package_types pt ON p.package_type_id = pt.package_type_id  -- Join to get package type name
            LEFT JOIN colors col ON c.color_id = col.color_id
            LEFT JOIN fuel_types ft ON cm.fuel_type_id = ft.fuel_type_id
            LEFT JOIN transmission_types tt ON cm.transmission_type_id = tt.transmission_type_id
            LEFT JOIN drive_types dt ON cm.drive_type_id = dt.drive_type_id
            LEFT JOIN car_status_types cs ON c.status_id = cs.status_id
            LEFT JOIN (
                SELECT model_id, MIN(image_url) AS image_url  -- Select the first image URL per model
                FROM car_model_images
                GROUP BY model_id
            ) cim ON cm.model_id = cim.model_id
            WHERE 1 = 1
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

        // Only add ORDER BY if there are conditions or parameters
        if (params.length > 0) {
            query += ' ORDER BY c.car_id DESC';
        }

        if (limit) {
            params.push(parseInt(limit, 10));
            query += ` LIMIT $${params.length}`;
        }

        const result = await client.query(query, params);
        console.log('Raw data from DB:', result.rows);  // Log the raw data

        // If price is missing or null, handle it here
        result.rows.forEach(car => {
            if (car.price === null) {
                console.log(`Missing price for car_id ${car.car_id}`);  // Log any issues
                car.price = 0;  // Set a default value if necessary
            }
        });
        res.json(result.rows);  // Return the result as a JSON response
    } catch (err) {
        console.error('Error fetching cars:', {
            message: err.message,
            stack: err.stack,
            queryParams: req.query,
        });
        res.status(500).json({ error: 'Database query failed', details: err.message });
    } finally {
        if (client) {
            client.release(); // Ensure client release
        }
    }
}



// Get Car Details
export async function getCarDetails(req, res) {
    const carId = req.params.carId;

    try {
        const client = await pool.connect();
        const query = `
            SELECT 
                c.car_id, 
                cm.model_name, 
                cm.manufacturer, 
                cm.description,
                col.color_name AS color, 
                cm.trailer_hitch, 
                tt.transmission_name, 
                dt.drive_type_name, 
                cm.seats, 
                cm.doors, 
                ft.fuel_type_name, 
                vt.vehicle_type_name, 
                cm.is_electric, 
                es.battery_capacity, 
                es.max_charging, 
                fs.fuel_tank_capacity, 
                fs.fuel_consumption, 
                fs.horse_power, 
                fs.engine_size, 
                fs.co2_emissions, 
                COALESCE(images.images, '{}') AS images,  -- Ensure images always return an array
                cm.config_basis, 
                cm.config_safety,  
                cm.config_entertainment,  
                cm.config_comfort  
            FROM cars c
            JOIN car_models cm ON c.model_id = cm.model_id
            LEFT JOIN colors col ON c.color_id = col.color_id
            LEFT JOIN transmission_types tt ON cm.transmission_type_id = tt.transmission_type_id
            LEFT JOIN drive_types dt ON cm.drive_type_id = dt.drive_type_id
            LEFT JOIN fuel_types ft ON cm.fuel_type_id = ft.fuel_type_id
            LEFT JOIN vehicle_types vt ON cm.vehicle_type_id = vt.vehicle_type_id
            LEFT JOIN electric_specs es ON cm.model_id = es.model_id
            LEFT JOIN fuel_specs fs ON cm.model_id = fs.model_id
            LEFT JOIN (
                SELECT model_id, array_agg(image_url) AS images
                FROM car_model_images
                GROUP BY model_id
            ) images ON cm.model_id = images.model_id
            WHERE c.car_id = $1;

        `;
        const result = await client.query(query, [carId]);
        client.release();

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Car not found' });
        }
    } catch (error) {
        console.error('Error fetching car details:', error.message);
        res.status(500).json({ error: 'Failed to fetch car details', details: error.message });
    }
}





