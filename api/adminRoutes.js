// Import the controller function
import { getReservations } from '../src/server/controllers/adminController.js';

// Vercel serverless function handler
export default function handler(req, res) {
    const { method, url } = req;

    // Handle GET requests for reservations
    if (method === 'GET' && url === '/reservations') {
        return getReservations(req, res);
    }

    // If no matching route, return 404
    res.status(404).send('Not Found');
}
