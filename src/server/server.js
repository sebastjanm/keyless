import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import carsRoutes from './routes/cars.js';
import filterRoutes from './routes/filters.js';
import subscriptionsRoutes from './routes/subscriptions.js';  
import adminRoutes from './routes/adminRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';  
import cors from 'cors';
import Stripe from 'stripe';

// Create __dirname using fileURLToPath and import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = config.app.port || 3000;
const stripe = new Stripe('sk_test_JTsR7sNb71As1Q5mrrhVkw4h00J1mWXsFd');  // Replace with your actual Stripe secret key

// Middleware
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());

// CORS configuration - adjust origin as needed
const allowedOrigins = [
    'http://localhost:3000',  // Local development
    'https://your-frontend-app.com'  // Production frontend domain
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
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
        });
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


