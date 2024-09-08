// Import necessary libraries
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

export default function handler(req, res) {
    // Check if it's a GET request
    if (req.method === 'GET') {
        // Fetch the Stripe publishable key from the environment variables
        const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY;

        // Ensure the key is available
        if (!publishableKey) {
            return res.status(500).json({ error: 'Publishable key not found. Please check your environment configuration.' });
        }

        // Respond with the publishable key
        return res.status(200).json({ publishableKey });
    } else {
        // If not a GET request, return 404
        res.status(404).send('Not Found');
    }
}
