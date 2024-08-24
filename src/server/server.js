import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import carsRoutes from './routes/cars.js';  // Adjust path if necessary
import filterRoutes from './routes/filters.js';

const app = express();
const port = config.app.port;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../public')));

app.use(express.json());

app.use('/cars', carsRoutes);  // Ensure this is correctly set
app.use('/filters', filterRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


