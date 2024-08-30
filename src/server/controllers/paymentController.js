import pkg from 'pg';
import config from '../config.js';

const { Pool } = pkg;
const pool = new Pool(config.db);


export async function processPaymentAndReservation(userData, reservationData, paymentData) {
    console.log('Received userData:', JSON.stringify(userData, null, 2));
    console.log('Received reservationData:', JSON.stringify(reservationData, null, 2));
    console.log('Received paymentData:', JSON.stringify(paymentData, null, 2));

            // Additional validation here
        if (!userData.name) {
            console.error('User data is missing the name field:', JSON.stringify(userData, null, 2));
            throw new Error('User data validation failed');
        }

        if (Object.keys(userData).length === 0 || Object.keys(reservationData).length === 0 || Object.keys(paymentData).length === 0) {
            throw new Error('One or more received data objects are empty. Aborting transaction.');
        }

        const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Start transaction
        console.log('Transaction started');

        // Step 1: Check if the user exists
        console.log('Checking if user exists...');
        const userQuery = `SELECT user_id FROM users WHERE email = $1`;
        const userResult = await client.query(userQuery, [userData.email]);

        let userId;
        if (userResult.rows.length === 0) {
            // Step 2: Validate User Data
            console.log('User does not exist, creating new user...');
            console.log('User Data:', JSON.stringify(userData, null, 2));

            // Check if any required fields are missing
            if (!userData.name || !userData.surname || !userData.email || !userData.mobile_phone || !userData.address || !userData.citizenship || !userData.password_hash) {
                throw new Error('Missing required user data fields: ' + JSON.stringify(userData, null, 2));
            }

            // Insert new user into the database
            const insertUserQuery = `
                INSERT INTO users (name, surname, email, mobile_phone, address, citizenship, status, password_hash)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING user_id
            `;
            const insertUserValues = [
                userData.name,
                userData.surname,
                userData.email,
                userData.mobile_phone,
                userData.address,
                userData.citizenship,
                'Verified',  // Assuming status is 'Verified' for successful transactions
                userData.password_hash
            ];
            const insertUserResult = await client.query(insertUserQuery, insertUserValues);
            userId = insertUserResult.rows[0].user_id;
            console.log('New user created with user_id:', userId);
        } else {
            // User exists, get user_id
            userId = userResult.rows[0].user_id;
            console.log('User exists with user_id:', userId);
        }

        // Step 3: Validate Reservation Data
        if (!reservationData.car_id || !reservationData.start_date || !reservationData.end_date) {
            throw new Error('Missing required reservation data fields: ' + JSON.stringify(reservationData, null, 2));
        }

        // Create a new reservation
        console.log('Creating new reservation...');
        const insertReservationQuery = `
            INSERT INTO reservations (user_id, car_id, start_date, end_date, status)
            VALUES ($1, $2, $3, $4, 'Active')
            RETURNING reservation_id
        `;
        const insertReservationValues = [
            userId,
            reservationData.car_id,
            reservationData.start_date,
            reservationData.end_date
        ];
        const insertReservationResult = await client.query(insertReservationQuery, insertReservationValues);
        const reservationId = insertReservationResult.rows[0].reservation_id;
        console.log('New reservation created with reservation_id:', reservationId);

        // Step 4: Validate Payment Data
        if (!paymentData.amount || !paymentData.stripe_payment_id) {
            throw new Error('Missing required payment data fields: ' + JSON.stringify(paymentData, null, 2));
        }

        // Create a new payment record
        console.log('Creating new payment record...');
        const insertPaymentQuery = `
            INSERT INTO payments (reservation_id, amount, stripe_payment_id)
            VALUES ($1, $2, $3)
        `;
        const insertPaymentValues = [
            reservationId,
            paymentData.amount,
            paymentData.stripe_payment_id
        ];
        await client.query(insertPaymentQuery, insertPaymentValues);
        console.log('New payment record created for reservation_id:', reservationId);

        await client.query('COMMIT'); // Commit transaction
        console.log('Transaction committed successfully');
        return { success: true, message: 'Payment and reservation processed successfully' };

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback transaction on error
        console.error('Error processing payment and reservation:', error);
    throw error; // Ensure this propagates correctly

    } finally {
        client.release(); // Release the client back to the pool
        console.log('Database client released');
    }
}



