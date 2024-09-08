// fetchPopularCars.js
export async function fetchPopularCars() {
    try {
        const response = await fetch('/api/cars/popular');  // Updated to use /api path for Vercel
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cars = await response.json();
        console.log('Fetched popular cars:', cars);  // Log to confirm the data
        return cars;
    } catch (error) {
        console.error('Error fetching popular cars:', error);
        throw error;
    }
}
