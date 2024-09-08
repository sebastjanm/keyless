// fetchSubscriptionOptions.js
export async function fetchSubscriptionOptions(carId) {
    try {
        // Fetch subscription options from the updated route
        const response = await fetch(`/api/subscriptions?carId=${carId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and return the JSON data
        const data = await response.json();
        return data;
    } catch (error) {
        // Log and rethrow the error for further handling
        console.error('Error fetching subscription options:', error.message);
        throw error;
    }
}
