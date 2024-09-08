// Import the controller function
import { getCars } from '../../src/server/controllers/carController.js';

export default function handler(req, res) {
    if (req.method === 'GET') {
        console.log('Serving all cars');
        return getCars(req, res);
    }

    res.status(404).send('Not Found');
}
