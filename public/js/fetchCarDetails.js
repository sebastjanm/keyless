// fetchCarDetails.js
export async function fetchCarDetails(carId) {
    try {
        const response = await fetch(`/cars/${carId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching car details:', error);
        throw error;
    }
}
