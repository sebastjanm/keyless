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

        // Create PaymentIntent on the server
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: 5000 }) // Example amount in cents
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


                // Validate the structure of personalData
                console.log('Validating personalData structure:', JSON.stringify(personalData, null, 2));

                const countryCodes = {
                    "Slovenia": "SI",
                    "United States": "US",
                    // Add more countries as needed
                };
                const countryCode = countryCodes[personalData.country] || personalData.country;


                const isLocal = window.location.hostname === 'localhost';
                const returnUrl = isLocal 
                    ? 'http://localhost:3000/confirmation.html'
                    : 'https://www.subscribe2go.com/confirmation.html';

                // Confirm payment with Stripe
                const { error } = await stripe.confirmPayment({
                    elements,
                    confirmParams: {
                        return_url: `${window.location.origin}/confirmation.html`, // Add return_url for redirection after payment
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
                await savePaymentAndReservation(clientSecret, personalData);

                console.log('Redirecting to confirmation page...');
                setTimeout(() => {
                    window.location.href = '/confirmation.html';
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

        console.log('Reservation Details:', JSON.stringify(reservationDetails, null, 2));

        if (!reservationDetails.carId || !reservationDetails.startDate || !reservationDetails.endDate) {
            throw new Error('Reservation data is incomplete or missing: ' + JSON.stringify(reservationDetails));
        }

        const response = await fetch('/payments/process-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
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
            })
        });

        console.log('Response object:', response);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Failed to save payment and reservation:', errorText);
            alert(`Error: Failed to save payment and reservation. ${response.statusText}`);
            throw new Error(`Failed to save payment and reservation: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Server Response:', result);

        if (response.ok && result.success) {
            console.log('Payment and reservation saved successfully.');
            alert('Payment and reservation saved successfully!');
        } else {
            console.warn('Failed to save payment and reservation:', result.message);
            alert(`Warning: Payment and reservation were not saved successfully. ${result.message}`);
        }
    } catch (error) {
        console.error('Error saving payment and reservation:', error);
        alert(`Error: An error occurred while saving payment and reservation. ${error.message}`);
    }
}
