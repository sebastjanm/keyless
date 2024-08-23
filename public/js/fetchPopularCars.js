export async function fetchPopularCars() {
    const carCardsContainer = document.getElementById('car-cards-container');

    if (carCardsContainer) {
        carCardsContainer.innerHTML = ''; // Clear existing content
    }

    try {
        const response = await fetch(`/cars?limit=4`); // Fetch limited cars

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const cars = await response.json();

        // Defensive Set to Track Rendered IDs
        const renderedCarIds = new Set();

        if (cars.length === 0) {
            carCardsContainer.innerHTML = '<p>No popular cars found.</p>';
        } else {
            cars.forEach(car => {
                if (!renderedCarIds.has(car.car_id)) { // Ensure no duplicate rendering
                    const carCard = document.createElement('a');
                    carCard.href = `car-details.html?carId=${car.car_id}`;
                    carCard.classList.add('block', 'border', 'bg-white', 'border-gray-300', 'rounded-lg', 'p-4', 'hover:shadow-lg');
                    carCard.innerHTML = `
                        <img src="${car.image}" alt="${car.manufacturer} ${car.model}" class="w-full h-auto rounded mb-4">
                        <h3 class="text-xl font-bold">${car.manufacturer} ${car.model}</h3>
                        <p class="text-gray-600">Fuel Type: ${car.fuel_type}</p>
                        <p class="text-gray-600">Transmission: ${car.transmission}</p>
                        <p class="text-blue-500 font-bold">Price: ${car.price} € per month</p>
                    `;
                    carCardsContainer.appendChild(carCard);
                    renderedCarIds.add(car.car_id); // Mark this car as rendered
                }
            });
        }
    } catch (error) {
        console.error('Error fetching popular cars:', error);
        carCardsContainer.innerHTML = '<p class="text-red-500">Failed to load popular cars. Please try again later.</p>';
    }
}
