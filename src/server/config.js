// src/server/config.js
import dotenv from 'dotenv';
dotenv.config();

export default {
    db: {
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: process.env.DB_PORT,
    },
    app: {
        port: process.env.PORT 
    }
};

