import pkg from 'pg';
import dotenv from 'dotenv';
dotenv.config();

const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

(async () => {
    try {
        const client = await pool.connect();
        console.log('Connected to the database successfully.');

        const res = await client.query('SELECT NOW()');
        console.log('Current time from the database:', res.rows[0]);

        client.release();
    } catch (err) {
        console.error('Error connecting to the database:', err);
    } finally {
        pool.end();
    }
})();
