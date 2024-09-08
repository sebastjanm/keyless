import { getClientSecretFromDB } from '../../src/server/controllers/paymentController.js';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const { paymentIntentId } = req.body;

            if (!paymentIntentId) {
                return res.status(400).json({ error: 'PaymentIntentId is required' });
            }

            console.log(`Fetching client secret for paymentIntentId: ${paymentIntentId}`);

            // Fetch client secret from the database
            const clientSecret = await getClientSecretFromDB(paymentIntentId);

            if (!clientSecret) {
                return res.status(404).json({ error: 'Client secret not found' });
            }

             console.log(`Client secret found for paymentIntentId: ${paymentIntentId}`);

            res.status(200).json({ clientSecret });
        } catch (error) {
            console.error('Error retrieving client secret:', error);
            res.status(500).json({ error: 'Failed to retrieve client secret', details: error.message });
        }
    } else {
        res.status(404).json({ error: 'Not Found Invalid request method' });
    }
}


