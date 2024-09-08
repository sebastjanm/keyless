// Import the controller function
import { processPaymentAndReservation } from '../../src/server/controllers/paymentController.js';

// Vercel serverless function handler (Stripe integration)
export default async function handler(req, res) {
    // Check the HTTP method and handle POST requests to `/process-payment`
    if (req.method === 'POST') {
        try {
            // In Vercel, body parsing is handled automatically, no need for body-parser
            const userData = {
                name: req.body.name,
                surname: req.body.surname,
                email: req.body.email,
                mobile_phone: req.body.mobile_phone,
                address: req.body.address,
                citizenship: req.body.citizenship,
                password_hash: req.body.password_hash
            };

            // Validate userData
            if (!userData.name || !userData.surname || !userData.email || !userData.mobile_phone || !userData.address || !userData.citizenship || !userData.password_hash) {
                return res.status(400).json({ error: 'User data is incomplete or missing' });
            }

            // Reservation data
            const reservationData = {
                car_id: req.body.car_id,
                start_date: req.body.start_date,
                end_date: req.body.end_date
            };

            // Validate reservationData
            if (!reservationData.car_id || !reservationData.start_date || !reservationData.end_date) {
                return res.status(400).json({ error: 'Reservation data is incomplete or missing' });
            }

            // Payment data
            const paymentData = {
                amount: req.body.amount,
                stripe_payment_id: req.body.stripe_payment_id
            };

            // Validate paymentData
            if (!paymentData.amount || !paymentData.stripe_payment_id) {
                return res.status(400).json({ error: 'Payment data is incomplete or missing' });
            }

            // Process payment and reservation via the controller function
            const result = await processPaymentAndReservation(userData, reservationData, paymentData);

            // Return the result of the payment processing
            if (result.success) {
                res.status(200).json({ message: result.message });
            } else {
                res.status(500).json({ error: result.message });
            }
        } catch (error) {
            res.status(500).json({ error: 'Failed to process payment and reservation', details: error.message });
        }
    } else {
        res.status(404).send('Not Found');
    }
}

