// stripe.js
async function createPaymentIntent(amount, personalInfo) {
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

        const stripe = Stripe('pk_test_7WLRdJPqXCD1EYQmZW3xCzKJ00Ivo5YzjO');
        const elements = stripe.elements();
        const cardElement = elements.create('card');
        console.log("Mounting card element...");
        cardElement.mount('#card-element');

        const form = document.getElementById('payment-form');
        if (!form) {
            throw new Error('Payment form not found in the DOM');
        }

        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            console.log("Form submitted. Attempting payment...");

            try {
                // Ensure cardElement is still mounted and available in the DOM
                if (!document.getElementById('card-element')) {
                    throw new Error('Card Element is not properly mounted.');
                }

                const countryCodes = {
                    "Slovenia": "SI",
                    "United States": "US",
                    // Add more countries as needed
                };
                const countryCode = countryCodes[personalInfo.country] || personalInfo.country;

                const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: `${personalInfo.firstName} ${personalInfo.lastName}`,
                            email: personalInfo.email,
                            address: {
                                city: personalInfo.city || '',
                                country: countryCode || '',
                                postal_code: personalInfo.postalCode || '',
                            },
                        },
                    },
                });

                if (error) {
                    console.error('Payment failed:', error.message);
                    alert(`Payment failed: ${error.message}`);
                } else if (paymentIntent) {
                    console.log('Payment Intent:', paymentIntent);
                    console.log('Payment Intent Status:', paymentIntent.status);

                    if (paymentIntent.status === 'succeeded') {
                        console.log('Payment succeeded, redirecting...');
                        setTimeout(() => {
                            window.location.href = '/confirmation.html';
                        }, 1000);  // 1 second delay
                    } else {
                        console.warn('Payment Intent did not succeed. Status:', paymentIntent.status);
                    }
                } else {
                    console.error('No payment intent returned.');
                }
            } catch (submitError) {
                console.error('Error during payment submission:', submitError);
            }
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
    }
}
