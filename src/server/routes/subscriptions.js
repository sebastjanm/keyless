// routes/subscriptions.js

import express from 'express';

import { getSubscriptionOptions } from '../controllers/subscriptionController.js'; // Ensure this path is correct
import { calculatePricing } from '../controllers/subscriptionController.js'; // Ensure the path is correct

const router = express.Router();

// Define the route to get subscription options
router.get('/', getSubscriptionOptions);
router.post('/calculate-pricing', calculatePricing);


export default router;


