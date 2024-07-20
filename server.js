import express from 'express';
import pkg from 'pg';
import path from 'path';
import { fileURLToPath } from 'url';

const { Pool } = pkg;
const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
    user: 'postgres.mcqwmcatahnptwuonghp',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    database: 'postgres',
    password: '97QgW3kt6UH9xM@',
    port: 6543,
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

function handleError(res, err, message) {
    console.error(message, err);
    res.status(500).json({ error: message });
}

app.get('/filters', async (req, res) => {
    try {
        const filters = await getFilters();
        res.json(filters);
    } catch (err) {
        handleError(res, err, 'Error fetching filters. Please try again later.');
    }
});

app.get('/cars', async (req, res) => {
    try {
        const cars = await getCars(req.query);
        res.json(cars);
    } catch (err) {
        handleError(res, err, 'Error fetching cars. Please try again later.');
    }
});

app.get('/car-details/:carId', async (req, res) => {
    const carId = parseInt(req.params.carId);
    if (isNaN(carId)) {
        res.status(400).json({ error: 'Invalid car ID' });
        return;
    }
    try {
        const car = await getCarDetails(carId);
        res.json(car);
    } catch (err) {
        handleError(res, err, 'Error fetching car details. Please try again later.');
    }
});

app.get('/subscription-options', async (req, res) => {
    try {
        const options = await getSubscriptionOptions();
        res.json(options);
    } catch (err) {
        handleError(res, err, 'Error fetching subscription options. Please try again later.');
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

async function getFilters() {
    try {
        const brandsQuery = await pool.query('SELECT DISTINCT manufacturer FROM car_models');
        const modelsQuery = await pool.query('SELECT DISTINCT model FROM car_models');
        const fuelTypesQuery = await pool.query('SELECT DISTINCT fuel_type FROM car_models');
        const vehicleTypesQuery = await pool.query('SELECT DISTINCT category_type FROM car_categories');
        const transmissionsQuery = await pool.query('SELECT DISTINCT transmission FROM car_models');
        const driveTrainsQuery = await pool.query('SELECT DISTINCT drive FROM car_models');
        const seatsQuery = await pool.query('SELECT DISTINCT seats FROM car_models');

        return {
            brands: brandsQuery.rows.map(row => row.manufacturer),
            models: modelsQuery.rows.map(row => row.model),
            fuelTypes: fuelTypesQuery.rows.map(row => row.fuel_type),
            vehicleTypes: vehicleTypesQuery.rows.map(row => row.category_type),
            transmissions: transmissionsQuery.rows.map(row => row.transmission),
            driveTrains: driveTrainsQuery.rows.map(row => row.drive),
            seats: seatsQuery.rows.map(row => row.seats),
        };
    } catch (err) {
        console.error('Error fetching filters:', err);
        throw new Error('Database query failed.');
    }
}

async function getCars(filters) {
    const { brand, model, fuel, vehicleType, transmission, driveTrain, seats } = filters;
    let query = `
        SELECT c.car_id, cm.*, c.status, p.monthly_payment AS price, p.extras AS reduced_price, c.mileage, cm.image
        FROM car_models cm
        JOIN cars c ON cm.model_id = c.model_id
        LEFT JOIN car_pricing cp ON c.car_id = cp.car_id
        LEFT JOIN pricing p ON cp.pricing_id = p.pricing_id
        WHERE 1=1
    `;
    const params = [];

    if (brand) {
        params.push(brand);
        query += ` AND cm.manufacturer = $${params.length}`;
    }
    if (model) {
        params.push(model);
        query += ` AND cm.model = $${params.length}`;
    }
    if (fuel) {
        params.push(fuel);
        query += ` AND cm.fuel_type = $${params.length}`;
    }
    if (vehicleType) {
        params.push(vehicleType);
        query += ` AND cm.category_id IN (SELECT category_id FROM car_categories WHERE category_type = $${params.length})`;
    }
    if (transmission) {
        params.push(transmission);
        query += ` AND cm.transmission = $${params.length}`;
    }
    if (driveTrain) {
        params.push(driveTrain);
        query += ` AND cm.drive = $${params.length}`;
    }
    if (seats) {
        params.push(seats);
        query += ` AND cm.seats = $${params.length}`;
    }

    try {
        const result = await pool.query(query, params);
        return result.rows;
    } catch (err) {
        console.error('Error fetching cars:', err);
        throw new Error('Database query failed.');
    }
}

async function getCarDetails(carId) {
    const carDetailsQuery = `
        SELECT 
            c.car_id, 
            cm.model_id, cm.image, cm.model, cm.manufacturer, cm.description, cm.acriss_code, 
            cm.trailer_hitch, cm.additional_cost_per_km, cm.transmission::text AS transmission, 
            cm.seats, cm.doors, cm.shopping_bags, cm.fuel_type::text AS fuel_type, 
            cm.fuel_consumption, cm.horse_power, cm.engine_size, cm.co2_emissions, 
            cm.battery_capacity, cm.max_charging, cm.drive::text AS drive, 
            cm.displacement, cm.config_basis AS basis, cm.config_safety AS safety, 
            cm.config_entertainment AS entertainment, cm.config_comfort AS comfort,
            c.status::text AS status, c.mileage, 
            p.monthly_payment AS price, p.administration_fee, p.extras AS reduced_price, 
            cat.category_type, e.efficiency_rating
        FROM cars c
        JOIN car_models cm ON c.model_id = cm.model_id
        LEFT JOIN car_pricing cp ON c.car_id = cp.car_id
        LEFT JOIN pricing p ON cp.pricing_id = p.pricing_id
        LEFT JOIN car_categories cat ON cm.category_id = cat.category_id
        LEFT JOIN energy_efficiency_ratings e ON cm.efficiency_id = e.efficiency_id
        WHERE c.car_id = $1
    `;

    const carColorsQuery = `
        SELECT col.color_name 
        FROM car_colors cc
        JOIN colors col ON cc.color_id = col.color_id
        WHERE cc.car_id = $1
    `;

    try {
        const carDetailsResult = await pool.query(carDetailsQuery, [carId]);
        const carColorsResult = await pool.query(carColorsQuery, [carId]);
        
        if (carDetailsResult.rows.length === 0) {
            throw new Error('Car not found.');
        }

        const carDetails = carDetailsResult.rows[0];
        carDetails.colors = carColorsResult.rows.map(row => row.color_name);
        
        return carDetails;
    } catch (err) {
        console.error('Error fetching car details:', err);
        throw new Error('Database query failed.');
    }
}

async function getSubscriptionOptions() {
    const locationsQuery = `
        SELECT name 
        FROM locations
        ORDER BY name ASC
    `;

    const insurancePackagesQuery = `
        SELECT unnest(enum_range(NULL::insurance_package_type)) AS insurance_package
    `;

    const subscriptionLengthsQuery = `
        SELECT length
        FROM subscription_length
        ORDER BY length ASC
    `;

    const subscriptionMileageQuery = `
        SELECT mileage
        FROM subscription_mileage
        ORDER BY mileage ASC
    `;

    try {
        const locationsResult = await pool.query(locationsQuery);
        const insurancePackagesResult = await pool.query(insurancePackagesQuery);
        const subscriptionLengthsResult = await pool.query(subscriptionLengthsQuery);
        const subscriptionMileageResult = await pool.query(subscriptionMileageQuery);

        return {
            locations: locationsResult.rows.map(row => row.name),
            insurancePackages: insurancePackagesResult.rows.map(row => row.insurance_package),
            subscriptionLengths: subscriptionLengthsResult.rows.map(row => row.length),
            subscriptionMileages: subscriptionMileageResult.rows.map(row => row.mileage),
        };
    } catch (err) {
        console.error('Error fetching subscription options:', err);
        throw new Error('Database query failed.');
    }
}
