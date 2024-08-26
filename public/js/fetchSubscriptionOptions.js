// fetchSubscriptionOptions.js
export async function fetchSubscriptionOptions() {
    try {
        const response = await fetch('/subscription-options');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching subscription options:', error);
        throw error;
    }
}



