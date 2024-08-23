// main.js

document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    mobileMenuButton.addEventListener('click', function () {
        mobileMenu.classList.toggle('hidden');
    });
});

// Function to handle the scroll event
function handleScroll() {
    const header = document.getElementById('top-menu');
    const logoText = document.getElementById('logo-text');
    const navLinks = document.getElementById('nav-links').getElementsByTagName('a');
    const menuLinks = document.getElementById('menu-links').getElementsByTagName('a');

    if (window.scrollY > 50) {
        header.classList.add('bg-orange');
        header.classList.remove('bg-black', 'bg-opacity-80');
        logoText.classList.remove('text-white');
        logoText.classList.add('text-black');
        
        for (let link of navLinks) {
            link.classList.remove('text-white');
            link.classList.add('text-black');
        }

        for (let link of menuLinks) {
            link.classList.remove('text-white');
            link.classList.add('text-black');
        }
    } else {
        header.classList.add('bg-black', 'bg-opacity-80');
        header.classList.remove('bg-white');
        logoText.classList.add('text-white');
        logoText.classList.remove('text-black');
        
        for (let link of navLinks) {
            link.classList.add('text-white');
            link.classList.remove('text-black');
        }

        for (let link of menuLinks) {
            link.classList.add('text-white');
            link.classList.remove('text-black');
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchFilters();
    fetchCars();

    document.getElementById('resetFilters').addEventListener('click', resetFilters);

    // Add event listeners to all select boxes and input fields
    const filterForm = document.getElementById('filterForm');
    filterForm.querySelectorAll('select').forEach(element => {
        element.addEventListener('change', fetchCars);
    });
});

// Fetch available filters from the server and populate select elements
async function fetchFilters() {
    try {
        const response = await fetch('/filters');
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const filters = await response.json();
        populateSelect('brand', filters.brands);
        populateSelect('vehicleType', filters.vehicleTypes);
        populateSelect('fuel', filters.fuelTypes);
        populateSelect('transmission', filters.transmissions);
        populateSelect('drive', filters.driveTrains); // Ensure drive train options are populated
        populateSelect('color', filters.colors);
        populateSelect('availability', filters.availability);
    } catch (error) {
        console.error('Error fetching filters:', error);
        showError('Error fetching filters. Please try again later.');
    }
}

// Populate a select element with options
function populateSelect(id, options) {
    const select = document.getElementById(id);
    if (!select) {
        console.error(`Select element with id '${id}' not found.`);
        return;
    }
    select.innerHTML = '<option value="">Select an option</option>'; // Clear any existing options and add default
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
}

// Fetch car data based on the selected filters and update the vehicle list
async function fetchCars() {
    try {
        const filterValues = getFilterValues();
        console.log('Filter Values:', filterValues); // Log filter values to check
        const queryParams = new URLSearchParams(filterValues).toString();
        console.log('Query Params:', queryParams); // Log query params
        const response = await fetch(`/cars?${queryParams}`);
        
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        
        const cars = await response.json();
        console.log('Fetched Cars:', cars); // Log fetched cars
        const vehicleList = document.getElementById('vehicleList');
        vehicleList.innerHTML = '';

        if (cars.length === 0) {
            vehicleList.innerHTML = '<p>No results found. Try different filters.</p>';
        } else {
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
                `;
                vehicleList.appendChild(carCard);
            });
        }
    } catch (error) {
        console.error('Error fetching cars:', error);
        showError('Error fetching cars. Please try again later.');
    }
}



// Get selected filter values from the form
function getFilterValues() {
    const filterForm = document.getElementById('filterForm');
    const filterValues = {};
    filterForm.querySelectorAll('select').forEach(element => {
        if (element.value) {
            filterValues[element.id] = element.value;
        }
    });
    return filterValues;
}

// Reset the filter form and fetch all cars
function resetFilters() {
    document.getElementById('filterForm').reset();
    fetchCars();
}

// Show an error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('bg-red-500', 'text-white', 'p-4', 'rounded', 'mb-4');
    errorDiv.textContent = message;
    document.body.insertBefore(errorDiv, document.body.firstChild);

    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
}

