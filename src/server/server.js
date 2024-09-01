import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
//import dotenv from 'dotenv';
import config from './config.js';
import carsRoutes from './routes/cars.js';
import filterRoutes from './routes/filters.js';
import subscriptionsRoutes from './routes/subscriptions.js';  
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';  
import cors from 'cors';
import Stripe from 'stripe';


// Initialize Stripe with the secret key (which is already loaded by config.js)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27',
});

// Create __dirname using fileURLToPath and import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = config.app.port || 3000;

// Middleware
app.use(express.static(path.join(__dirname, '../../public')));  // Correct path to serve static files
app.use(express.json());


// Endpoint to send the publishable key to the frontend
app.get('/config', (req, res) => {
    res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

// CORS configuration - adjust origin as needed
const allowedOrigins = [
    'http://localhost:3000',  // Local development
    'https://www.subscribe2go.com'  // Production frontend domain
];

app.use(cors({
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));


// Routes
app.use('/cars', carsRoutes);
app.use('/filters', filterRoutes);
app.use('/subscription-options', subscriptionsRoutes);
app.use('/payments', paymentRoutes);  // Use the payment routes

// Use the admin routes
app.use('/admin', adminRoutes);

// Stripe Payment Intent Route
app.post('/create-payment-intent', async (req, res) => {
    try {
        const { amount } = req.body;
        console.log('Amount received:', amount); // Debugging line

        // Create a payment intent with the specified amount
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
        });

        // Send the client secret back to the client
        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error); // Debugging line
        res.status(500).send({ error: error.message });
    }
});


// Server Initialization
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
