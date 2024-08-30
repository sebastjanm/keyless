// admin.js

// Function to format date strings to a more readable format
function formatDate(dateString) {
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    };
    return new Date(dateString).toLocaleString(undefined, options);
}

// Function to format currency amounts to EUR
function formatCurrency(amount) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
}


// Function to load reservations and apply conditional styling
async function loadReservations() {
    try {
        const response = await fetch('/admin/reservations');
        const reservations = await response.json();

        if (!Array.isArray(reservations)) {
            throw new Error('Unexpected response format');
        }

        const reservationsTableBody = document.getElementById('reservationsTableBody');
        reservationsTableBody.innerHTML = ''; // Clear any existing data

        reservations.forEach(reservation => {
     

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="px-6 py-4 whitespace-nowrap">${reservation.status}</td>
                <td class="px-6 py-4 whitespace-nowrap">${reservation.reservation_id}</td>
                <td class="px-6 py-4 whitespace-nowrap">${reservation.car}</td>
                <td class="px-6 py-4 whitespace-nowrap">${reservation.user_name}</td>
                <td class="px-6 py-4 whitespace-nowrap">${formatDate(reservation.start_date)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${formatDate(reservation.end_date)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${formatCurrency(reservation.total_paid || 0)}</td>
                <td class="px-6 py-4 whitespace-nowrap">${formatDate(reservation.created_at)}</td>
            `;
            reservationsTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading reservations:', error);
    }
}

// Set up automatic refresh for reservations every 30 seconds
setInterval(loadReservations, 30000); // 30,000 milliseconds = 30 seconds

// Call these functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadReservations();
    startCountdown(); // Start the countdown timer
});

// Timer function to update countdown every second
function startCountdown() {
    let timeLeft = 30; // 30 seconds countdown
    const timerElement = document.getElementById('refreshTimer');

    const countdownInterval = setInterval(() => {
        if (timeLeft <= 0) {
            timeLeft = 30; // Reset timer after 30 seconds
        }
        timerElement.textContent = `Next refresh in: ${timeLeft--}s`;
    }, 1000);
}
