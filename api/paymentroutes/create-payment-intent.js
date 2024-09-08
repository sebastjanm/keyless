import Stripe from 'stripe';
import { saveClientSecretToDB } from '../../src/server/controllers/paymentController.js';  // Ensure the path is correct

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
});

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { amount } = req.body;

            // Validate amount
            if (!amount || amount <= 0) {
                return res.status(400).json({ error: 'Invalid amount for payment intent' });
            }

            // Create a payment intent with the specified amount
            const paymentIntent = await stripe.paymentIntents.create({
                amount, // amount in cents
                currency: 'eur',
            });

            console.log('Payment intent created:', paymentIntent.id);

            // Add logging for `clientSecret` and `paymentIntentId`
            const clientSecret = paymentIntent.client_secret;
            const paymentIntentId = paymentIntent.id;
            console.log(`Payment Intent ID: ${paymentIntentId}`);
            console.log(`Client Secret: ${clientSecret}`);

            // Save the payment intent and client secret to the database
            try {
                console.log('Attempting to save PaymentIntent to DB...');
                await saveClientSecretToDB(paymentIntentId, clientSecret, null, amount);  // null for userId if not available
                console.log('PaymentIntent saved successfully to DB.');
            } catch (dbError) {
                console.error('Error saving payment intent to DB:', dbError);
            }

            // Return the client secret
            return res.status(200).json({ clientSecret });

        } catch (error) {
            console.error('Error creating payment intent:', error);
            return res.status(500).json({ error: 'Failed to create payment intent', details: error.message });
        }
    } else {
        return res.status(404).send('Not Found');
    }
}
