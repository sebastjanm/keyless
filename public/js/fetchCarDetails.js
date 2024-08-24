export async function fetchCarDetailsAndOptions(carId) {
    try {
        const response = await fetch(`/api/car-details/${carId}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch car details: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching car details and subscription options:', error);
        return null;
    }
}
