// In cars.js (routes)
import express from 'express';
import { getCars, getCarDetails, getPopularCars } from '../controllers/carController.js';

const router = express.Router();

router.get('/:carId', getCarDetails);

export default router;
