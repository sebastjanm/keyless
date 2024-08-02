// src/server/server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.js';
import carRoutes from './routes/cars.js';
import filterRoutes from './routes/filters.js';
import { preloadData } from './preloadData.js';

const app = express();
const port = config.app.port;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../public'), {
    setHeaders: (res, path, stat) => {
        if (path.endsWith('.css')) {
            res.set('Content-Type', 'text/css');
        }
    }
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../public', 'index.html'));
});

app.use(express.json());

app.use('/cars', carRoutes);
app.use('/filters', filterRoutes);

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    preloadData();
});

export default app;
