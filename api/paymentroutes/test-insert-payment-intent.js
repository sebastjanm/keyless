import pkg from 'pg';
import config from '../../src/server/config.js';  // Adjusted path to config.js

const { Pool } = pkg;
const pool = new Pool(config.db);

// Temporary function to test database insert outside of payment flow
export async function testInsertPaymentIntent(req, res) {
    const client = await pool.connect();

    try {
        console.log('Testing direct insertion into the payment_intents table...');

        // Hardcoded test values
        const paymentIntentId = 'pi_test123';
        const clientSecret = 'test_client_secret';
        const userId = 1;  // Change based on existing user in your database
        const amount = 10000;

        // Begin transaction
        await client.query('BEGIN');
        console.log('Transaction started.');

        // Insert query for testing
        const insertPaymentIntentQuery = `
            INSERT INTO payment_intents (stripe_payment_intent_id, client_secret, user_id, amount)
            VALUES ($1, $2, $3, $4)
            RETURNING payment_intent_id
        `;
        const insertPaymentIntentValues = [paymentIntentId, clientSecret, userId, amount];

        console.log('Running insert query:', insertPaymentIntentQuery);
        console.log('With values:', insertPaymentIntentValues);

        const result = await client.query(insertPaymentIntentQuery, insertPaymentIntentValues);

        if (result.rows.length === 0) {
            console.error('Insert failed: No rows returned.');
            throw new Error('Failed to insert test payment intent into the database.');
        }

        console.log('Test insert successful:', result.rows[0]);

        // Commit transaction
        await client.query('COMMIT');
        console.log('Test transaction committed successfully.');

        return res.status(200).json({ success: true, message: 'Test insert successful' });

    } catch (error) {
        console.error('Error occurred during test insert:', error.message);
        await client.query('ROLLBACK');
        console.log('Test transaction rolled back.');
        return res.status(500).json({ error: 'Test insert failed', details: error.message });
    } finally {
        client.release();
        console.log('Test complete: database client released.');
    }
}

// Export the handler for the route
export default testInsertPaymentIntent;
