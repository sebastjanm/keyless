document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("Confirmation page script loaded.");

        // Fetch payment intent details from the server
        console.log("Sending request to fetch payment intent details from server...");
        const paymentIntentResponse = await fetch('/api/paymentroutes/get-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ paymentIntentId: sessionStorage.getItem('paymentIntentId') })  // Use the stored paymentIntentId
        });

        console.log("Response from /get-payment-intent:", paymentIntentResponse);

        if (!paymentIntentResponse.ok) {
            throw new Error('Failed to fetch payment intent details from server.');
        }

        const { clientSecret, paymentIntentId } = await paymentIntentResponse.json();
        console.log('Received paymentIntentId:', paymentIntentId);
        console.log('Received clientSecret:', clientSecret);

        if (!clientSecret) {
            throw new Error('Client secret not found.');
        }

        // Retrieve personalData and selectedSubscription from sessionStorage
        const personalData = JSON.parse(sessionStorage.getItem('personalData'));
        const selectedSubscription = JSON.parse(sessionStorage.getItem('selectedSubscription'));

        if (!personalData) {
            console.warn('Personal data not found in sessionStorage.');
        }

        if (!selectedSubscription) {
            console.warn('Selected subscription data not found in sessionStorage.');
        }

        /* ===================================
           POPULATE PAYMENT DETAILS
        =================================== */
        document.getElementById('payment-intent-id').textContent = paymentIntentId || 'N/A';
        document.getElementById('subscription-amount').textContent = `${selectedSubscription.calculatedPricing.monthlyFee} €`;
        document.getElementById('payment-status').textContent = 'Succeeded';
        document.getElementById('payment-method').textContent = 'Card';  // Assuming card is used

        /* ===================================
           POPULATE PERSONAL DETAILS
        =================================== */
        document.getElementById('firstName').textContent = personalData ? personalData.firstName : 'N/A';
        document.getElementById('lastName').textContent = personalData ? personalData.lastName : 'N/A';
        document.getElementById('email').textContent = personalData ? personalData.email : 'N/A';

        console.log("Payment confirmation page successfully populated with data.");
    } catch (error) {
        console.error('Error loading confirmation details:', error);
        alert('There was an error loading your confirmation details. Please contact support.');
    }
});
