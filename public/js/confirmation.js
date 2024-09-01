document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log("Confirmation page script loaded.");

        // Fetch the publishable key from the server
        const configResponse = await fetch('/config');
        if (!configResponse.ok) {
            throw new Error('Failed to fetch publishable key.');
        }
        const { publishableKey } = await configResponse.json();
        if (!publishableKey) {
            throw new Error('Publishable key not found in config response.');
        }

        // Initialize Stripe with the publishable key
        const stripe = Stripe(publishableKey, { apiVersion: '2020-08-27' });

        // Extract query parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        const clientSecret = urlParams.get('payment_intent_client_secret');

        if (!clientSecret) {
            throw new Error('Payment Intent Client Secret not found in URL parameters.');
        }

        // Retrieve the PaymentIntent details from Stripe
        const { paymentIntent, error } = await stripe.retrievePaymentIntent(clientSecret);

        if (error) {
            throw new Error(`Error retrieving Payment Intent: ${error.message}`);
        }

        console.log('PaymentIntent retrieved:', paymentIntent);

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
        document.getElementById('payment-intent-id').textContent = paymentIntent.id || 'N/A';
        document.getElementById('subscription-amount').textContent = formatAmount(paymentIntent.amount, paymentIntent.currency);
        document.getElementById('payment-status').textContent = paymentIntent.status || 'N/A';
        document.getElementById('payment-method').textContent = paymentIntent.payment_method_types[0] || 'N/A';
        document.getElementById('payment-date').textContent = formatDate(paymentIntent.created);

        /* ===================================
           POPULATE PERSONAL DETAILS
        =================================== */
        document.getElementById('firstName').textContent = personalData ? personalData.firstName : 'N/A';
        document.getElementById('lastName').textContent = personalData ? personalData.lastName : 'N/A';
        document.getElementById('email').textContent = personalData ? personalData.email : 'N/A';

        /* ===================================
           POPULATE SUBSCRIPTION DETAILS
        =================================== */
        if (selectedSubscription && selectedSubscription.carDetails) {
            const carDetails = selectedSubscription.carDetails;
            const pricing = selectedSubscription.calculatedPricing;

            document.getElementById('car-title').textContent = `${carDetails.manufacturer} ${carDetails.model_name}` || 'N/A';
            document.getElementById('monthly-price').textContent = `${pricing.monthlyFee} €` || 'N/A';

            // Additional subscription details
            document.getElementById('kilometer-options').textContent = getMileagePlan(selectedSubscription) || 'N/A';
            document.getElementById('subscription-duration').textContent = getDuration(selectedSubscription) || 'N/A';
            document.getElementById('insurance-package').textContent = getInsurancePackage(selectedSubscription) || 'N/A';
            document.getElementById('delivery').textContent = getDeliveryOption(selectedSubscription) || 'N/A';
        } else {
            console.warn('Subscription details are incomplete or missing.');
        }

    } catch (error) {
        console.error('Error loading confirmation details:', error);
        alert('There was an error loading your confirmation details. Please contact support.');
    }
});

/* ===================================
   HELPER FUNCTIONS
=================================== */

function formatAmount(amount, currency) {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency || 'EUR',
        minimumFractionDigits: 2,
    });
    return formatter.format((amount || 0) / 100);
}

function formatDate(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

function getMileagePlan(subscription) {
    const plan = subscription.subscriptionOptions.mileagePlans.find(
        (p) => p.plan_id === parseInt(subscription.selectedMileagePlanId)
    );
    return plan ? `${plan.kilometers} km/month` : 'N/A';
}

function getDuration(subscription) {
    const duration = subscription.subscriptionOptions.subscriptionDurations.find(
        (d) => d.duration_id === parseInt(subscription.selectedDurationId)
    );
    return duration ? `${duration.months} months` : 'N/A';
}

function getInsurancePackage(subscription) {
    const insurance = subscription.subscriptionOptions.insurancePackages.find(
        (i) => i.insurance_package_id === parseInt(subscription.selectedInsurancePackageId)
    );
    return insurance ? insurance.package_name : 'N/A';
}

function getDeliveryOption(subscription) {
    const delivery = subscription.subscriptionOptions.deliveryOptions.find(
        (d) => d.option_id === parseInt(subscription.selectedDeliveryOptionId)
    );
    return delivery ? delivery.option_name : 'N/A';
}
