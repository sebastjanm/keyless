export default function handler(req, res) {
    console.log(`Request received at /api/vehicles: ${req.method} ${req.url}`);

    // Handle the GET request for /api/vehicles/popular
    if (req.method === 'GET' && req.url === '/api/vehicles/popular') {
        console.log('Serving vehicles popular endpoint');
        return res.status(200).json({ message: 'Vehicles popular endpoint works!' });
    }

    // If route is not matched, log and return 404
    console.log(`404 Not Found for /api/vehicles route: ${req.url}`);
    return res.status(404).send('Not Found');
}
