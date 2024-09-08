// Import the controller function
import { getSubscriptionOptions } from '../../src/server/controllers/subscriptionController.js';

// Vercel serverless function handler
export default function handler(req, res) {
    const { method } = req;

    // Handle GET requests for subscription options
    if (method === 'GET') {
        console.log('Fetching subscription options');
        return getSubscriptionOptions(req, res);
    }

    // If no matching route, return 404
    res.status(404).send('Not Found');
}
