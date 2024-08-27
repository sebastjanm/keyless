// Create Payment Intent with Stripe
async function createPaymentIntent(amount, personalInfo) {
    try {
        const response = await fetch('/create-payment-intent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount }) // Amount passed dynamically from main.js
        });

        const { clientSecret } = await response.json();

        const stripe = Stripe('your-publishable-key');
        const elements = stripe.elements();
        const cardElement = elements.create('card');

        // Mount the card element
        cardElement.mount('#card-element');

        const form = document.getElementById('payment-form');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();

            const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: `${personalInfo.firstName} ${personalInfo.lastName}`,
                        email: personalInfo.email,
                        address: {
                            city: personalInfo.city || null,
                            country: personalInfo.country || null,
                            postal_code: personalInfo.postalCode || null,
                        },
                    },
                },
            });

            if (error) {
                console.error('Payment failed:', error.message);
                alert(`Payment failed: ${error.message}`);
            } else if (paymentIntent && paymentIntent.status === 'succeeded') {
                alert('Payment successful!');
            }
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
    }
}
