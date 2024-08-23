import express from 'express';
import { getCars, getCarDetails } from '../controllers/carController.js';

const router = express.Router();

router.get('/', getCars);
router.get('/car-details/:carId', getCarDetails);

export default router;
