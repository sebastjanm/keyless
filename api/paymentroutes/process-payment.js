// Import the controller function
import { processPaymentAndReservation } from '../../src/server/controllers/paymentController.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { stripePaymentId, name, surname, email, mobile_phone, address, citizenship, password_hash, car_id, start_date, end_date, selected_duration_id, selected_mileage_plan_id, selected_insurance_package_id, selected_delivery_option_id, amount } = req.body;

            // Validate request data
            if (!stripePaymentId || !name || !surname || !email || !mobile_phone || !address || !citizenship || !password_hash || !car_id || !start_date || !end_date || !selected_duration_id || !selected_mileage_plan_id || !selected_insurance_package_id || !selected_delivery_option_id || !amount) {
                return res.status(400).json({ error: 'Required data is missing or incomplete' });
            }

            // Prepare user, reservation, and payment data for processing
            const userData = { name, surname, email, mobile_phone, address, citizenship, password_hash };
            const reservationData = { car_id, start_date, end_date, selected_duration_id, selected_mileage_plan_id, selected_insurance_package_id, selected_delivery_option_id };
            const paymentData = { amount, stripe_payment_id: stripePaymentId };

            // Process the payment and reservation using the controller function
            const result = await processPaymentAndReservation(userData, reservationData, paymentData);

            // Return success or error response
            if (result.success) {
                res.status(200).json({ success: true, message: result.message });
            } else {
                res.status(500).json({ success: false, message: result.message });
            }

        } catch (error) {
            console.error('Error processing payment and reservation:', error.message);
            res.status(500).json({ error: 'Failed to process payment and reservation', details: error.message });
        }
    } else {
        res.status(404).json({ error: 'Not Found' });
    }
}
