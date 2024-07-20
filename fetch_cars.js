const { Pool } = require('pg');

// Database connection configuration
const pool = new Pool({
    user: 'postgres.mcqwmcatahnptwuonghp',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    database: 'postgres',
    password: '97QgW3kt6UH9xM@',
    port: 6543,
});

// Function to fetch cars
async function fetchCars() {
    const client = await pool.connect();
    try {
        const query = `
            SELECT cm.model_id, cm.manufacturer, cm.model, cm.fuel_type, cm.transmission, cm.drive, cm.seats, c.status
            FROM car_models cm
            JOIN cars c ON cm.model_id = c.model_id
        `;
        const result = await client.query(query);
        console.log('Fetched cars:', result.rows);
    } catch (error) {
        console.error('Error fetching cars:', error);
    } finally {
        client.release();
    }
}

// Run the fetchCars function
fetchCars().catch(error => console.error('Unexpected error:', error));
