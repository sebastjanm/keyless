(function() {
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
        console.log(`sessionStorage set: ${key} = ${value}`);
        originalSetItem.apply(this, arguments);
    };

    const originalClear = sessionStorage.clear;
    sessionStorage.clear = function() {
        console.log('sessionStorage cleared');
        originalClear.apply(this, arguments);
    };
})();

// Updated stripe.js
(async function() {
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
        console.log(`sessionStorage set: ${key} = ${value}`);
        originalSetItem.apply(this, arguments);
    };

    const originalClear = sessionStorage.clear;
    sessionStorage.clear = function() {
        console.log('sessionStorage cleared');
        originalClear.apply(this, arguments);
    };
})();

// Updated stripe.js
(async function() {
    const originalSetItem = sessionStorage.setItem;
    sessionStorage.setItem = function(key, value) {
        console.log(`sessionStorage set: ${key} = ${value}`);
        originalSetItem.apply(this, arguments);
    };

    const originalClear = sessionStorage.clear;
    sessionStorage.clear = function() {
        console.log('sessionStorage cleared');
        originalClear.apply(this, arguments);
    };
})();

// Updated stripe.js
async function createPaymentIntent(amount) {
    try {
        console.log("Creating payment intent...");

        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        });

        if (!response.ok) {
            throw new Error(`Error from server: ${response.statusText}`);
        }

        const { clientSecret } = await response.json();
        if (!clientSecret) {
            throw new Error('Missing clientSecret from server response');
        }
        console.log("Received clientSecret:", clientSecret);

        // Define the appearance and options for the Payment Element
        const appearance = {
            theme: 'flat',
            variables: {
                colorPrimary: '#0570de',
                colorPrimaryText: '#262626',
                colorText: '#30313d',
                colorDanger: '#df1b41',
                spacingUnit: '3px',
            }
        };

        const options = {
            layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: true,
                spacedAccordionItems: true
            }
        };

        // Initialize Stripe elements with the clientSecret and appearance options
        const stripe = Stripe('pk_test_7WLRdJPqXCD1EYQmZW3xCzKJ00Ivo5YzjO'); // Replace with your actual Stripe public key
        const elements = stripe.elements({ clientSecret, appearance });

        // Create and mount the Payment Element
        const paymentElement = elements.create('payment', options);
        console.log("Mounting Payment Element...");
        paymentElement.mount('#payment-element');

        const form = document.getElementById('payment-form');
        if (!form) {
            throw new Error('Payment form not found in the DOM');
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Form submitted. Attempting payment...");

            try {
                // Retrieve personalData from sessionStorage
                const personalData = JSON.parse(sessionStorage.getItem('personalData'));

                if (!personalData) {
                    console.error('Personal data not found in sessionStorage.');
                    alert('Error: Personal data not found. Please fill out the form again.');
                    return;
                }

            const isLocal = window.location.hostname === 'localhost';
            const returnUrl = isLocal 
                ? 'http://localhost:3000/confirmation.html'
                : 'https://www.subscribe2go.com/confirmation.html';

                const { error } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: returnUrl,
                        payment_method_data: {
                            billing_details: {
                                name: `${personalData.firstName} ${personalData.lastName}`,
                                email: personalData.email,
                                address: {
                                    city: personalData.city || '',
                                    country: personalData.country || '',
                                    postal_code: personalData.postalCode || '',
                                },
                            },
                        },
                    },
                });

                if (error) {
                    console.error('Payment failed:', error.message);
                    alert(`Payment failed: ${error.message}`);
                } else {
                    console.log('Payment succeeded, processing reservation...');
                    // Handle post-payment logic here
                }
            } catch (submitError) {
                console.error('Error during payment submission:', submitError);
            }
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
    }
}




/* ===================================
   SAVE PAYMENT & RESERVATION  LOGIC
=================================== */

async function savePaymentAndReservation(stripePaymentId, personalData) {
    try {
        console.log('Starting to save payment and reservation data...');

        const selectedSubscription = JSON.parse(sessionStorage.getItem('selectedSubscription'));
        if (!selectedSubscription) {
            throw new Error('No selected subscription found in sessionStorage.');
        }

        const carDetails = selectedSubscription.carDetails;

        // Ensure that all required reservation details are present
        const reservationDetails = {
            carId: selectedSubscription.carId,
startDate: selectedSubscription.startDate || '2024-01-01',  // Add dummy start date if missing
            endDate: selectedSubscription.endDate || '2024-12-31',      // Add dummy end date if missing
            selectedDurationId: selectedSubscription.selectedDurationId,
            selectedMileagePlanId: selectedSubscription.selectedMileagePlanId,
            selectedInsurancePackageId: selectedSubscription.selectedInsurancePackageId,
            selectedDeliveryOptionId: selectedSubscription.selectedDeliveryOptionId,
            calculatedPricing: selectedSubscription.calculatedPricing,
        };

        // Log the reservationDetails to see what's missing
        console.log('Reservation Details:', JSON.stringify(reservationDetails, null, 2));

        // Check for missing required fields
        if (!reservationDetails.carId || !reservationDetails.startDate || !reservationDetails.endDate) {
            throw new Error('Reservation data is incomplete or missing: ' + JSON.stringify(reservationDetails));
        }

        const response = await fetch('/payments/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                stripePaymentId,
                name: personalData.firstName,
                surname: personalData.lastName,
                email: personalData.email,
                mobile_phone: personalData.phone,
                address: `${personalData.address}, ${personalData.city}, ${personalData.postalCode}, ${personalData.country}`,
                citizenship: personalData.residenceStatus,
                password_hash: "hashed_password", // Replace with secure hash or handle on server-side
                car_id: carDetails.car_id,
                start_date: reservationDetails.startDate,
                end_date: reservationDetails.endDate,
                selected_duration_id: reservationDetails.selectedDurationId,
                selected_mileage_plan_id: reservationDetails.selectedMileagePlanId,
                selected_insurance_package_id: reservationDetails.selectedInsurancePackageId,
                selected_delivery_option_id: reservationDetails.selectedDeliveryOptionId,
                amount: parseInt(reservationDetails.calculatedPricing.monthlyFee.replace('€', '').trim()) * 100, // Convert to cents
                stripe_payment_id: stripePaymentId
            })
        });

        console.log('Response object:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to save payment and reservation:', errorText);
            alert(`Error: Failed to save payment and reservation. ${response.statusText}`);
            throw new Error(`Failed to save payment and reservation: ${response.statusText}`);
        }


/* ===================================
   GET URL PARAMETERS LOGIC
=================================== */

// Function to get URL parameters
function getQueryParams() {
    const params = new URLSearchParams(window.location.search);
    return {
        paymentIntentId: params.get('payment_intent'),
        amount: params.get('amount'),
        currency: params.get('currency'),
    };
}

const paymentData = getQueryParams();

// Update the page with the extracted data (initially)
document.getElementById('payment-intent-id').textContent = paymentData.paymentIntentId || 'N/A';
document.getElementById('payment-amount').textContent = `${paymentData.amount / 100 || 'N/A'} ${paymentData.currency ? paymentData.currency.toUpperCase() : ''}`;

// Fetch and display additional payment and customer details
async function fetchPaymentDetails(paymentIntentId) {
    try {
        const response = await fetch(`/payment-details/${paymentIntentId}`);
        if (!response.ok) throw new Error('Failed to fetch payment details');
        const { paymentIntent, customer } = await response.json();

        // Update the DOM with additional customer and payment info
        document.getElementById('payment-intent-id').textContent = paymentIntent.id || 'N/A';
        document.getElementById('payment-amount').textContent = `${(paymentIntent.amount_received / 100).toFixed(2)} ${paymentIntent.currency.toUpperCase()}`;
        document.getElementById('customer-email').textContent = customer.email || 'N/A';
        document.getElementById('customer-name').textContent = `${customer.name || 'N/A'}`;
        document.getElementById('payment-status').textContent = paymentIntent.status || 'N/A';
        document.getElementById('payment-method').textContent = paymentIntent.payment_method_types.join(', ') || 'N/A';
        document.getElementById('payment-date').textContent = new Date(paymentIntent.created * 1000).toLocaleDateString() || 'N/A';

    } catch (error) {
        console.error('Error fetching payment details:', error);
        alert('Failed to load payment details.');
    }
}

// Fetch detailed payment information if paymentIntentId is available
if (paymentData.paymentIntentId) {
    fetchPaymentDetails(paymentData.paymentIntentId);
} else {
    console.error('No paymentIntentId found in URL.');
}

//-----------


const result = await response.json();
console.log('Server Response:', result);

if (response.ok && result.success) {
    console.log('Payment and reservation saved successfully.');
    alert('Payment and reservation saved successfully!');
} else if (!response.ok) {
    console.warn('Failed to save payment and reservation:', result.message);
    alert(`Warning: Payment and reservation were not saved successfully. ${result.message}`);
} else {
    console.warn('Unexpected response:', result.message);
    alert(`Warning: Unexpected issue during the payment and reservation process.`);
}
    } catch (error) {
        console.error('Error saving payment and reservation:', error);
        alert(`Error: An error occurred while saving payment and reservation. ${error.message}`);
    }
}









