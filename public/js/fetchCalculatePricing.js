// fetchCalculatePricing.js
export async function fetchCalculatePricing(pricingData) {
    try {
        const response = await fetch('/api/subscriptions/calculate-pricing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pricingData)  // Include the pricing data in the request body
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error calculating pricing:', error.message);
        throw error;
    }
}
