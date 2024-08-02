// src/public/js/fetchCarDetails.js
export async function fetchCarDetails(carId) {
    try {
        const response = await fetch(`/car-details/${carId}`);
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const carDetails = await response.json();
        displayCarDetails(carDetails);
    } catch (error) {
        console.error('Error fetching car details:', error);
        showError('Error fetching car details. Please try again later.');
    }
}

function displayCarDetails(car) {
    const carDetailsContainer = document.getElementById('car-details-container');
    carDetailsContainer.innerHTML = `
        <img src="${car.image}" alt="${car.manufacturer} ${car.model}" class="w-full h-auto rounded mb-4">
        <h3 class="text-xl font-bold">${car.manufacturer} ${car.model}</h3>
        <p class="text-gray-600">Fuel Type: ${car.fuel_type}</p>
        <p class="text-gray-600">Transmission: ${car.transmission}</p>
        <p class="text-gray-600">Drive: ${car.drive}</p>
        <p class="text-gray-600">Seats: ${car.seats}</p>
        <p class="text-gray-600">Status: ${car.status}</p>
        <p class="text-blue-500 font-bold">Price: ${car.price} € per month</p>
        <p class="text-gray-600">Description: ${car.description}</p>
    `;
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('bg-red-500', 'text-white', 'p-4', 'rounded', 'mb-4');
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}
