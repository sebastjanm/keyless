import express from 'express';
import { processPaymentAndReservation } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/process-payment', async (req, res) => {
    try {
        // Construct userData object from the request body
        const userData = {
            name: req.body.name,
            surname: req.body.surname,
            email: req.body.email,
            mobile_phone: req.body.mobile_phone,
            address: req.body.address,
            citizenship: req.body.citizenship,
            password_hash: req.body.password_hash // Ensure this is securely hashed
        };

        // Validate the userData object
        if (!userData.name || !userData.surname || !userData.email || !userData.mobile_phone || !userData.address || !userData.citizenship || !userData.password_hash) {
            console.error('User data is incomplete or missing:', JSON.stringify(userData, null, 2));
            return res.status(400).json({ error: 'User data is incomplete or missing' });
        }

        // Construct reservationData object from the request body
        const reservationData = {
            car_id: req.body.car_id,
            start_date: req.body.start_date,
            end_date: req.body.end_date
        };

        // Validate reservationData
        if (!reservationData.car_id || !reservationData.start_date || !reservationData.end_date) {
            console.error('Reservation data is incomplete or missing:', JSON.stringify(reservationData, null, 2));
            return res.status(400).json({ error: 'Reservation data is incomplete or missing' });
        }

        // Construct paymentData object from the request body
        const paymentData = {
            amount: req.body.amount,
            stripe_payment_id: req.body.stripe_payment_id
        };

        // Validate paymentData
        if (!paymentData.amount || !paymentData.stripe_payment_id) {
            console.error('Payment data is incomplete or missing:', JSON.stringify(paymentData, null, 2));
            return res.status(400).json({ error: 'Payment data is incomplete or missing' });
        }

        // Log all received data before processing
        console.log('Received userData:', JSON.stringify(userData, null, 2));
        console.log('Received reservationData:', JSON.stringify(reservationData, null, 2));
        console.log('Received paymentData:', JSON.stringify(paymentData, null, 2));

        // Process payment and reservation
        const result = await processPaymentAndReservation(userData, reservationData, paymentData);

        // Handle the result
        if (result.success) {
            res.status(200).json({ message: result.message });
        } else {
            console.error('Failed to process payment and reservation:', result.message);
            res.status(500).json({ error: result.message });
        }
    } catch (error) {
        console.error('Error processing payment and reservation:', error.message);
        res.status(500).json({ error: 'Failed to process payment and reservation' });
    }
});

export default router;
