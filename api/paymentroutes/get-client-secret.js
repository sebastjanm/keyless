import { getClientSecretFromDB } from '../../src/server/controllers/paymentController.js'; // Implement this function

export default async function handler(req, res) {
    if (req.method === 'GET') {
        const { paymentIntentId } = req.query;

        if (!paymentIntentId) {
            return res.status(400).json({ error: 'PaymentIntent ID is required' });
        }

        try {
            // Fetch the client secret securely from the database
            const clientSecret = await getClientSecretFromDB(paymentIntentId);

            if (!clientSecret) {
                return res.status(404).json({ error: 'Client secret not found for the given PaymentIntent ID' });
            }

            res.status(200).json({ clientSecret });
        } catch (error) {
            res.status(500).json({ error: 'Failed to retrieve client secret', details: error.message });
        }
    } else {
        res.status(404).send('Not Found');
    }
}
