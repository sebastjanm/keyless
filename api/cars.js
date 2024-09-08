// Import the controller functions
import { getPopularCars, getCars, getCarDetails } from '../src/server/controllers/carController.js';

// Vercel serverless function handler
export default function handler(req, res) {
    const { url, method } = req;

    console.log(`Incoming request - Method: ${method}, URL: ${url}`);

    if (method === 'GET') {
        // Handle `/popular` route explicitly
        if (url === '/api/cars/popular') {
            console.log('Serving popular cars');
            return getPopularCars(req, res);
        }

        // Handle `/` route explicitly
        if (url === '/api/cars') {
            console.log('Serving all cars');
            return getCars(req, res);
        }

        // Handle `/api/cars/1`, `/api/cars/2` explicitly
        if (url === '/api/cars/1') {
            console.log('Serving car details for ID 1');
            req.params = { carId: '1' };
            return getCarDetails(req, res);
        }
        if (url === '/api/cars/2') {
            console.log('Serving car details for ID 2');
            req.params = { carId: '2' };
            return getCarDetails(req, res);
        }
    }

    console.log(`404 Not Found for URL: ${url}`);
    res.status(404).send('Not Found');
}
