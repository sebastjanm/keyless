// src/public/js/fetchCars.js
export async function fetchCars() {
    const carCardsContainer = document.getElementById('car-cards-container');
    const vehicleList = document.getElementById('vehicleList');

    try {
        const filterValues = getFilterValues();
        console.log('Filter Values:', filterValues);
        const queryParams = new URLSearchParams(filterValues).toString();
        console.log('Query Params:', queryParams);
        const response = await fetch(`/cars?${queryParams}`);

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }

        const cars = await response.json();
        console.log('Fetched Cars:', cars);

        if (carCardsContainer) {
            carCardsContainer.innerHTML = '';
        }
        if (vehicleList) {
            vehicleList.innerHTML = '';
        }

        if (cars.length === 0) {
            if (vehicleList) {
                vehicleList.innerHTML = '<p>No results found. Try different filters.</p>';
            }
        } else {
            cars.slice(0, 4).forEach(car => {
                const carCard = document.createElement('a');
                carCard.href = `car-details.html?carId=${car.car_id}`;
                carCard.classList.add('block', 'border', 'bg-white', 'border-gray-300', 'rounded-lg', 'p-4', 'hover:shadow-lg');
                carCard.innerHTML = `
                    <img src="${car.image}" alt="${car.manufacturer} ${car.model}" class="w-full h-auto rounded mb-4">
                    <h3 class="text-xl font-bold">${car.manufacturer} ${car.model}</h3>
                    <p class="text-gray-600">Fuel Type: ${car.fuel_type}</p>
                    <p class="text-gray-600">Transmission: ${car.transmission}</p>
                    <p class="text-gray-600">Drive: ${car.drive}</p>
                    <p class="text-gray-600">Seats: ${car.seats}</p>
                    <p class="text-gray-600">Status: ${car.status}</p>
                    <p class="text-blue-500 font-bold">Price: ${car.price} € per month</p>
                `;
                if (carCardsContainer) {
                    carCardsContainer.appendChild(carCard);
                }
                if (vehicleList) {
                    vehicleList.appendChild(carCard.cloneNode(true));
                }
            });
        }
    } catch (error) {
        console.error('Error fetching cars:', error);
        if (carCardsContainer) {
            carCardsContainer.innerHTML = '<p class="text-red-500">Failed to load car data. Please try again later.</p>';
        }
        showError('Error fetching cars. Please try again later.');
    }
}

function getFilterValues() {
    const filterForm = document.getElementById('filterForm');
    const filterValues = {};
    if (filterForm) {
        filterForm.querySelectorAll('select').forEach(element => {
            if (element.value) {
                filterValues[element.id] = element.value;
            }
        });
    }
    return filterValues;
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
