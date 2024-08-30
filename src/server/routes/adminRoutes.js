// routes/adminRoutes.js
import express from 'express';
import { getReservations } from '../controllers/adminController.js';

const router = express.Router();

router.get('/reservations', getReservations);

export default router;
