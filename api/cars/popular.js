// Import your controller function
import { getPopularCars } from '../../src/server/controllers/carController.js';

// Export the handler for Vercel serverless functions
export default function handler(req, res) {
    if (req.method === 'GET') {
        console.log('Serving popular cars');
        return getPopularCars(req, res);
    }
    res.status(404).send('Not Found');
}
