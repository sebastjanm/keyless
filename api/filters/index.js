// Import the controller function
import { getFilters } from '../../src/server/controllers/filterController.js';

// Vercel serverless function handler
export default function handler(req, res) {
    // Extracting the method for routing logic
    const { method } = req;

    if (method === 'GET') {
        // Handle the `/api/filters` route
        console.log('Fetching filters');
        return getFilters(req, res);
    }

    // If no matching route is found, return 404
    console.log('404 Not Found');
    res.status(404).send('Not Found');
}
