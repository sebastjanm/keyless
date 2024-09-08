// Import your controller function
import { getCarDetails } from '../../src/server/controllers/carController.js';

// Export the handler for Vercel serverless functions
export default function handler(req, res) {
    const { carId } = req.query;

    if (req.method === 'GET') {
        console.log(`Serving details for car ID: ${carId}`);
        req.params = { carId };  // Simulate Express-style params
        return getCarDetails(req, res);
    }
    res.status(404).send('Not Found');
}
