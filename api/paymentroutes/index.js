import { processPaymentAndReservation, saveClientSecretToDB } from '../../src/server/controllers/paymentController.js';  // Import saveClientSecretToDB
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
});

// Vercel serverless function handler (Stripe integration)
export default async function handler(req, res) {
    // Handle GET request to /config to send the publishable key
    if (req.method === 'GET' && req.url === '/config') {
        try {
            res.status(200).json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve publishable key', details: error.message });
        }
    }

    // Handle POST request to /create-payment-intent
    else if (req.method === 'POST' && req.url === '/create-payment-intent') {
        try {
            const { amount, userId } = req.body;  // Extract userId

            // Validate amount
            if (!amount || amount <= 0) {
                return res.status(400).json({ error: 'Invalid amount for payment intent' });
            }

            if (!userId) {
                return res.status(400).json({ error: 'User ID is required for creating payment intent' });
            }

            // Create a payment intent with the specified amount
            const paymentIntent = await stripe.paymentIntents.create({
                amount,
                currency: 'eur',
            });

            console.log('Payment intent created:', paymentIntent.id);

            // Save client secret and payment intent in the database
            try {
                await saveClientSecretToDB(paymentIntent.id, paymentIntent.client_secret, userId, amount);
                console.log('Successfully saved Payment Intent to DB');
            } catch (dbError) {
                console.error('Database save failed:', dbError);
                return res.status(500).json({ error: 'Failed to save payment intent to database' });
            }

            // Return the client secret
            res.status(200).json({ clientSecret: paymentIntent.client_secret });
        } catch (error) {
            res.status(500).json({ error: 'Failed to create payment intent', details: error.message });
        }
    }

    // Handle POST requests to `/process-payment` for processing payments and reservations
    else if (req.method === 'POST' && req.url === '/process-payment') {
        try {
            // Extract and validate user data
            const userData = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                mobile_phone: req.body.mobile_phone,
                address: req.body.address,
                citizenship: req.body.citizenship,
                password_hash: req.body.password_hash
            };

            if (!userData.name || !userData.surname || !userData.email || !userData.mobile_phone || !userData.address || !userData.citizenship || !userData.password_hash) {
                return res.status(400).json({ error: 'User data is incomplete or missing' });
            }

            // Extract and validate reservation data
            const reservationData = {
                car_id: req.body.car_id,
                start_date: req.body.start_date,
                end_date: req.body.end_date
            };

            if (!reservationData.car_id || !reservationData.start_date || !reservationData.end_date) {
                return res.status(400).json({ error: 'Reservation data is incomplete or missing' });
            }

            // Extract and validate payment data
            const paymentData = {
                amount: req.body.amount,
                stripe_payment_id: req.body.stripe_payment_id
            };

            if (!paymentData.amount || !paymentData.stripe_payment_id) {
                return res.status(400).json({ error: 'Payment data is incomplete or missing' });
            }

            // Process payment and reservation via the controller function
            const result = await processPaymentAndReservation(userData, reservationData, paymentData);

            if (result.success) {
                res.status(200).json({ message: result.message });
            } else {
                res.status(500).json({ error: result.message });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to process payment and reservation', details: error.message });
        }
    }

    // Return 404 for unsupported methods or routes
    else {
        res.status(404).send('Not Found');
    }
}
