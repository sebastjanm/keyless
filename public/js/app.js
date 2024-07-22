document.addEventListener('DOMContentLoaded', () => {
    fetchFilters();
    fetchCars();

    document.getElementById('resetFilters').addEventListener('click', resetFilters);
});

async function fetchFilters() {
    try {
        const response = await fetch('/filters');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const filters = await response.json();
        populateSelect('brand', filters.brands);
        populateSelect('model', filters.models);
        populateSelect('fuel', filters.fuelTypes);
        populateSelect('vehicleType', filters.vehicleTypes);
        populateSelect('transmission', filters.transmissions);
        populateSelect('driveTrain', filters.driveTrains);
        populateSelect('seats', filters.seats);
    } catch (error) {
        console.error('Error fetching filters:', error);
        showError('Error fetching filters. Please try again later.');
    }
}

function populateSelect(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = ''; // Clear any existing options
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

async function fetchCars() {
    try {
        const response = await fetch('/cars');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const cars = await response.json();
        const vehicleList = document.getElementById('vehicleList');
        vehicleList.innerHTML = '';
        cars.forEach(car => {
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
                <p class="text-red-500">Reduced from: ${car.reduced_price} € per month</p>
            `;
            vehicleList.appendChild(carCard);
        });
    } catch (error) {
        console.error('Error fetching cars:', error);
        showError('Error fetching cars. Please try again later.');
    }
}

function resetFilters() {
    document.getElementById('filterForm').reset();
    fetchCars();
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
