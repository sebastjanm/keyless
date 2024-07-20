const axios = require('axios');

const baseURL = 'http://localhost:3000';

async function testFilters() {
    try {
        // Test vehicleType filter
        let response = await axios.get(`${baseURL}/cars`, { params: { vehicleType: 'Electric Car' } });
        console.log('Vehicle Type Filter:', response.data);

        // Test brand filter
        response = await axios.get(`${baseURL}/cars`, { params: { brand: 'Tesla' } });
        console.log('Brand Filter:', response.data);

        // Test fuel filter
        response = await axios.get(`${baseURL}/cars`, { params: { fuel: 'Electric' } });
        console.log('Fuel Filter:', response.data);

        // Test transmission filter
        response = await axios.get(`${baseURL}/cars`, { params: { transmission: 'Automatic' } });
        console.log('Transmission Filter:', response.data);

        // Test driveTrain filter
        response = await axios.get(`${baseURL}/cars`, { params: { driveTrain: 'All-Wheel Drive' } });
        console.log('Drive Train Filter:', response.data);

        // Test numberOfSeats filter
        response = await axios.get(`${baseURL}/cars`, { params: { numberOfSeats: '5' } });
        console.log('Number of Seats Filter:', response.data);

        // Test combination of filters
        response = await axios.get(`${baseURL}/cars`, {
            params: {
                vehicleType: 'Electric Car',
                brand: 'Tesla',
                fuel: 'Electric',
                transmission: 'Automatic',
                driveTrain: 'All-Wheel Drive',
                numberOfSeats: '5'
            }
        });
        console.log('Combination of Filters:', response.data);
    } catch (error) {
        if (error.response) {
            console.error('Error testing filters:', error.response.data);
        } else if (error.request) {
            console.error('No response received:', error.request);
        } else {
            console.error('Error setting up request:', error.message);
        }
    }
}

testFilters();
