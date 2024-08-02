// src/server/routes/filters.js
import express from 'express';
import { preloadedData } from '../preloadData.js';

const router = express.Router();

router.get('/', (req, res) => {
    try {
        console.log('Received request for /filters');
        res.json(preloadedData.filters);
    } catch (err) {
        handleError(res, err, 'Error fetching filters');
    }
});

function handleError(res, err, message) {
    console.error(message, err);
    res.status(500).json({ error: `${message}: ${err.message}` });
}

export default router;
