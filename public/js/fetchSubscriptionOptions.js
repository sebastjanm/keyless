// fetchSubscriptionOptions.js

export async function fetchSubscriptionOptions(carId) {
    try {
        const response = await fetch(`/subscription-options?carId=${carId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching subscription options:', error.message);
        throw error;
    }
}
