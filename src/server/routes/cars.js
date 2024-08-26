// In cars.js (routes)
import express from 'express';
import { getPopularCars, getCars, getCarDetails } from '../controllers/carController.js';

const router = express.Router();

router.get('/popular', getPopularCars);
router.get('/', getCars);
router.get('/:carId', getCarDetails);


export default router;






