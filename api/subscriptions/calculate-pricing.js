// Import the controller function
import { calculatePricing } from '../../src/server/controllers/subscriptionController.js';

// Vercel serverless function handler
export default async function handler(req, res) {
    const { method } = req;

    // Handle POST requests for calculating pricing
    if (method === 'POST') {
        console.log('Calculating subscription pricing');
        return calculatePricing(req, res);
    }

    // If no matching route, return 404
    res.status(404).send('Not Found');
}
