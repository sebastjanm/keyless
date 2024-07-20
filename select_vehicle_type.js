import pkg from 'pg';
import inquirer from 'inquirer';

const { Pool } = pkg;

// Database connection configuration
const pool = new Pool({
    user: 'postgres.mcqwmcatahnptwuonghp',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    database: 'postgres',
    password: '97QgW3kt6UH9xM@',
    port: 6543,
});

// Function to fetch vehicle types
async function fetchVehicleTypes() {
    const client = await pool.connect();
    try {
        const query = 'SELECT DISTINCT category_type FROM car_categories';
        const result = await client.query(query);
        return result.rows.map(row => row.category_type);
    } catch (error) {
        console.error('Error fetching vehicle types:', error);
    } finally {
        client.release();
    }
}

// Function to fetch cars by vehicle type
async function fetchCarsByType(vehicleType) {
    const client = await pool.connect();
    try {
        const query = `
            SELECT cm.model_id, cm.manufacturer, cm.model, cm.fuel_type, cm.transmission, cm.drive, cm.seats, c.status
            FROM car_models cm
            JOIN cars c ON cm.model_id = c.model_id
            JOIN car_categories cc ON cm.category_id = cc.category_id
            WHERE cc.category_type = $1
        `;
        const result = await client.query(query, [vehicleType]);
        return result.rows;
    } catch (error) {
        console.error('Error fetching cars:', error);
    } finally {
        client.release();
    }
}

// Function to prompt user for vehicle type and display cars
async function promptForVehicleType() {
    try {
        const vehicleTypes = await fetchVehicleTypes();
        if (!vehicleTypes || vehicleTypes.length === 0) {
            console.error('No vehicle types found.');
            return;
        }
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'vehicleType',
                message: 'Select a vehicle type:',
                choices: vehicleTypes,
            },
        ]);
        const cars = await fetchCarsByType(answers.vehicleType);
        if (!cars || cars.length === 0) {
            console.log(`No cars found for vehicle type ${answers.vehicleType}.`);
        } else {
            console.log(`Cars of type ${answers.vehicleType}:`);
            console.table(cars);
        }
    } catch (error) {
        console.error('Unexpected error:', error);
    }
}

// Run the prompt function
promptForVehicleType().catch(error => console.error('Unexpected error:', error));
