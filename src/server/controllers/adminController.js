// controllers/adminController.js
import pkg from 'pg';
import config from '../config.js';

const { Pool } = pkg;
const pool = new Pool(config.db);

export async function getReservations(req, res) {
    try {
        const client = await pool.connect();
        const query = `
            SELECT 
                r.reservation_id, 
                u.name || ' ' || u.surname AS user_name,
                cm.manufacturer || ' ' || cm.model_name AS car,
                TO_CHAR(r.start_date, 'YYYY-MM-DD') AS start_date, 
                TO_CHAR(r.end_date, 'YYYY-MM-DD') AS end_date, 
                r.status, 
                TO_CHAR(r.created_at, 'YYYY-MM-DD HH24:MI:SS') AS created_at,
                COALESCE(SUM(p.amount), 0) AS total_paid
            FROM reservations r
            JOIN users u ON r.user_id = u.user_id
            JOIN cars c ON r.car_id = c.car_id
            JOIN car_models cm ON c.model_id = cm.model_id
            LEFT JOIN payments p ON r.reservation_id = p.reservation_id
            GROUP BY r.reservation_id, u.name, u.surname, cm.manufacturer, cm.model_name
            ORDER BY r.created_at DESC;
        `;
        const result = await client.query(query);
        console.log(result.rows); // Ensure total_paid is correctly logged here
        client.release();

        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching reservations:', err.message);
        res.status(500).json({ error: 'Failed to fetch reservations', details: err.message });
    }
}


