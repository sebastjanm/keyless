// src/server/routes/cars.js
import express from 'express';
import { preloadedData } from '../preloadData.js';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        console.log('Received request for /cars');
        res.json(preloadedData.cars);
    } catch (err) {
        handleError(res, err, 'Error fetching cars');
    }
});

router.get('/car-details/:carId', async (req, res) => {
    const carId = parseInt(req.params.carId);
    if (isNaN(carId)) {
        res.status(400).json({ error: 'Invalid car ID' });
        return;
    }
    try {
        const car = preloadedData.cars.find(c => c.car_id === carId);
        if (!car) {
            res.status(404).json({ error: 'Car not found' });
        } else {
            res.json(car);
        }
    } catch (err) {
        handleError(res, err, 'Error fetching car details');
    }
});

function handleError(res, err, message) {
    console.error(message, err);
    res.status(500).json({ error: `${message}: ${err.message}` });
}

export default router;
