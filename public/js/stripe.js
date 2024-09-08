// Load publishable key and create PaymentIntent
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Fetch the publishable key from the server
        const { publishableKey } = await fetch('/config').then((r) => r.json());
        if (!publishableKey) {
            throw new Error('Publishable key not found. Please check your server configuration.');
        }

        // Initialize Stripe with the publishable key
        const stripe = Stripe(publishableKey, { apiVersion: '2020-08-27' });

        // Check if #payment-element exists before proceeding
        const paymentElement = document.querySelector('#payment-element');
        if (!paymentElement) {
            console.log('Payment Element not found in the DOM. Skipping payment setup.');
            return; // Skip the rest of the script if the payment element doesn't exist
        }

        // Retrieve subscription details from sessionStorage
        const selectedSubscription = JSON.parse(sessionStorage.getItem('selectedSubscription'));
        if (!selectedSubscription || !selectedSubscription.carId || !selectedSubscription.calculatedPricing) {
            throw new Error('Invalid subscription data found in sessionStorage.');
        }

        // Calculate the amount based on the subscription
        const amountInCents = parseFloat(selectedSubscription.calculatedPricing.monthlyFee.replace('€', '').trim()) * 100;
        if (isNaN(amountInCents) || amountInCents <= 0) {
            throw new Error('Invalid amount calculated for PaymentIntent.');
        }

        // Create PaymentIntent on the server with the correct amount
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: amountInCents }) // Send the correct amount
        });

        if (!response.ok) {
            const errorDetails = await response.text(); // Get error details for better debugging
            throw new Error(`Failed to create payment intent. Server response: ${errorDetails}`);
        }

        const { clientSecret } = await response.json();
        if (!clientSecret) {
            throw new Error('Failed to retrieve client secret from server.');
        }

        console.log("Received clientSecret:", clientSecret);

        // Initialize Stripe elements with the PaymentIntent's clientSecret and appearance options
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
        const elements = stripe.elements({ clientSecret, appearance });

        console.log("Mounting Payment Element...");
        elements.create('payment', {
            layout: {
                type: 'accordion',
                defaultCollapsed: false,
                radios: true,
                spacedAccordionItems: true
            }
        }).mount(paymentElement);

        const form = document.getElementById('payment-form');
        if (!form) {
            throw new Error('Payment form not found in the DOM');
        }

        let submitted = false;
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Form submitted. Attempting payment...");

            // Prevent double submissions
            if (submitted) return;
            submitted = true;
            form.querySelector('button').disabled = true;

            try {
                // Retrieve personalData from sessionStorage
                const personalData = JSON.parse(sessionStorage.getItem('personalData'));
                if (!personalData || !personalData.firstName || !personalData.email) {
                    throw new Error('Personal data not found in sessionStorage. Please fill out the form again.');
                }

                // Define countryCode based on personalData
                const countryCodes = {
                    "Slovenia": "SI",
                    "Croatia": "HR",
                    "United States": "US",
                    // Add more countries as needed
                };
                const countryCode = countryCodes[personalData.country] || personalData.country;

                // Determine if the environment is local or production
                const isLocal = window.location.hostname === 'localhost';
                const returnUrl = isLocal 
                    ? 'http://localhost:3000/confirmation.html'
                    : 'https://www.subscribe2go.com/confirmation.html';

                // Confirm payment with Stripe
                const { error, paymentIntent } = await stripe.confirmPayment({
                    elements,
                    redirect: 'if_required', // Prevents automatic redirection
                    confirmParams: {
                        payment_method_data: {
                            billing_details: {
                                name: `${personalData.firstName} ${personalData.lastName}`,
                                email: personalData.email,
                                address: {
                                    city: personalData.city || '',
                                    country: countryCode || '',
                                    postal_code: personalData.postalCode || '',
                                },
                            },
                        },
                    },
                });

                if (error) {
                    console.error('Payment failed:', error.message);
                    alert(`Payment failed: ${error.message}`);
                    submitted = false;
                    form.querySelector('button').disabled = false;
                    return;
                }

                console.log('Payment succeeded, processing reservation...');
                
                // Save payment and reservation details after payment succeeds
                await savePaymentAndReservation(clientSecret, personalData);

                console.log('Redirecting to confirmation page...');
                setTimeout(() => {
                    // Manual redirection after data has been saved
                    const returnUrl = isLocal 
                        ? 'http://localhost:3000/confirmation.html'
                        : 'https://www.subscribe2go.com/confirmation.html';

                    window.location.href = returnUrl; // Use the correct return URL for redirection
                }, 1000);

            } catch (submitError) {
                console.error('Error during payment submission:', submitError);
                alert(`Error: ${submitError.message}`);
                submitted = false;
                form.querySelector('button').disabled = false;
            }
        });

    } catch (error) {
        console.error('Error initializing payment process:', error);
        alert(`Error: ${error.message}`);
    }
});

/* ===================================
   SAVE PAYMENT & RESERVATION LOGIC
=================================== */

async function savePaymentAndReservation(clientSecret, personalData) {
    try {
        console.log('Starting to save payment and reservation data...');

        const selectedSubscription = JSON.parse(sessionStorage.getItem('selectedSubscription'));
        if (!selectedSubscription || !selectedSubscription.carId || !selectedSubscription.calculatedPricing) {
            throw new Error('Invalid subscription data found in sessionStorage.');
        }

        const carDetails = selectedSubscription.carDetails;

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

        console.log('Reservation Details:', JSON.stringify(reservationDetails, null, 2));

        if (!reservationDetails.carId || !reservationDetails.startDate || !reservationDetails.endDate) {
            throw new Error('Reservation data is incomplete or missing: ' + JSON.stringify(reservationDetails));
        }

        const dataToSend = {
            stripePaymentId: clientSecret,
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
        };

        // Validate the data before sending it to the server
        if (!validateData(dataToSend)) {
            console.error('Validation failed, not sending data to the server.');
            return;
        }

        console.log('Data to be sent to the database:', JSON.stringify(dataToSend, null, 2));

        const response = await fetch('/payments/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dataToSend)
        });

        console.log('Response object from the server:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to save payment and reservation:', errorText);
            alert(`Error: Failed to save payment and reservation. ${response.statusText}`);
            throw new Error(`Failed to save payment and reservation: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Server Response after saving to database:', JSON.stringify(result, null, 2));

        if (result.success) {
            console.log('Payment and reservation saved successfully.');
            alert('Payment and reservation saved successfully!');
            
            // Use a breakpoint here to manually pause the script
            debugger;

            // Redirect to the confirmation page after checking the data
            window.location.href = '/confirmation.html';
        } else {
            console.warn('Failed to save payment and reservation:', result.message);
            alert(`Warning: Payment and reservation were not saved successfully. ${result.message}`);
        }
    } catch (error) {
        console.error('Error saving payment and reservation:', error);
        alert(`Error: An error occurred while saving payment and reservation. ${error.message}`);
    }
}

// Function to validate the data before sending it to the server
function validateData(data) {
    if (!data.stripePaymentId || typeof data.stripePaymentId !== 'string') {
        console.error('Missing or invalid stripePaymentId');
        return false;
    }
    if (!data.car_id || typeof data.car_id !== 'number') {
        console.error('Missing or invalid car_id');
        return false;
    }
    if (!data.start_date || isNaN(Date.parse(data.start_date))) {
        console.error('Missing or invalid start_date');
        return false;
    }
    if (!data.end_date || isNaN(Date.parse(data.end_date))) {
        console.error('Missing or invalid end_date');
        return false;
    }
    if (!data.amount || typeof data.amount !== 'number' || data.amount <= 0) {
        console.error('Missing or invalid amount');
        return false;
    }
    return true;
}
