const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
    user: 'postgres.mcqwmcatahnptwuonghp',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    database: 'postgres',
    password: '97QgW3kt6UH9xM@',
    port: 6543,
});

pool.on('connect', () => {
    console.log('Connected to the database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

// Check if all required tables, columns, and enums exist
const checkDatabaseIntegrity = async () => {
    const requiredTables = {
        car_models: ['model_id', 'image', 'model', 'manufacturer', 'description', 'fuel_type', 'transmission', 'seats', 'doors', 'drive', 'category_id', 'battery_capacity'],
        cars: ['car_id', 'model_id', 'vin', 'registration', 'mileage', 'battery_charge_level', 'status', 'condition'],
        car_categories: ['category_id', 'category_type'],
        subscriptions: ['subscription_id', 'user_id', 'car_id', 'pricing_id', 'config_id', 'start_date', 'end_date', 'monthly_mileage', 'additional_mileage_cost', 'total_mileage', 'total_cost', 'additional_cost_per_km', 'insurance_package', 'pickup_location_id', 'dropoff_location_id', 'rental_phase'],
        subscription_configurations: ['config_id', 'contract_length', 'km_per_month'],
        locations: ['location_id', 'name', 'address', 'postcode', 'latitude', 'longitude']
    };

    const requiredEnums = {
        fuel_type: ['Petrol', 'Diesel', 'Electric', 'Hybrid'],
        transmission_type: ['Manual', 'Automatic'],
        drive_type: ['Front-Wheel Drive', 'Rear-Wheel Drive', 'All-Wheel Drive'],
        insurance_package_type: ['None', 'Small', 'CareFree'],
        delivery_status_type: ['Pending', 'In Transit', 'Delivered', 'Cancelled'],
        rental_phase_type: ['Reserved', 'Delivery', 'Rental', 'Returned'],
        car_status_type: ['Available', 'Reserved', 'Rented', 'Maintenance', 'Decommissioned'],
        car_condition_type: ['New', 'Good', 'Fair', 'Poor']
    };

    for (const [table, columns] of Object.entries(requiredTables)) {
        try {
            const res = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${table}'`);
            const existingColumns = res.rows.map(row => row.column_name);
            columns.forEach(column => {
                if (!existingColumns.includes(column)) {
                    throw new Error(`Column ${column} does not exist in table ${table}`);
                }
            });
        } catch (err) {
            console.error(`Error checking table ${table}:`, err);
            process.exit(-1);
        }
    }

    for (const [enumName, values] of Object.entries(requiredEnums)) {
        try {
            const res = await pool.query(`SELECT unnest(enum_range(NULL::${enumName})) AS enum_value`);
            const existingValues = res.rows.map(row => row.enum_value);
            values.forEach(value => {
                if (!existingValues.includes(value)) {
                    throw new Error(`Enum value ${value} does not exist in enum ${enumName}`);
                }
            });
        } catch (err) {
            console.error(`Error checking enum ${enumName}:`, err);
            process.exit(-1);
        }
    }
};

module.exports = { pool, checkDatabaseIntegrity };
