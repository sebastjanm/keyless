import express from 'express';
import { getCars, getCarDetails, getPopularCars } from '../controllers/carController.js';

const router = express.Router();

router.get('/', getCars);
router.get('/car-details/:carId', getCarDetails);
router.get('/popular', getPopularCars);

export default router;
