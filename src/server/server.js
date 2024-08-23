import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import carRoutes from './routes/cars.js';
import filterRoutes from './routes/filters.js';

const app = express();
const port = config.app.port;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../public')));

app.use(express.json());

app.use('/cars', carRoutes);
app.use('/filters', filterRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
