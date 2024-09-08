// fetchCarDetails.js
export async function fetchCarDetails(carId) {
    try {
        const response = await fetch(`/api/cars/${carId}`);  // Updated to use /api path for Vercel
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching car details:', error);
        throw error;
    }
}
