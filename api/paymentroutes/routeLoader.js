import fs from 'fs';
import path from 'path';

export const loadRoutes = (app, routeDirectory) => {
    fs.readdirSync(routeDirectory).forEach((file) => {
        // Exclude index.js from being included
        if (file !== 'index.js' && file.endsWith('.js')) {
            const route = require(path.join(routeDirectory, file));
            
            // Use the file name (without extension) as the route name
            const routeName = `/${file.replace('.js', '')}`;
            
            // Register the route handler
            app.use(routeName, route.default || route);
        }
    });
};
