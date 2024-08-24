import { fetchPopularCars } from './fetchPopularCars.js';
import { fetchAllCars } from './fetchAllCars.js';
import { fetchFilters } from './fetchFilters.js';
import { fetchCarDetailsAndOptions } from './fetchCarDetails.js';

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    // Clear session storage on load to prevent old data issues
    sessionStorage.removeItem('popularCars');
    sessionStorage.removeItem('cars');
    sessionStorage.removeItem('carDetails');

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Detect page context and call the appropriate function
    if (document.getElementById('popular-cars')) {
        loadPopularCars();
    } else if (document.getElementById('vehicleList')) {
        loadFiltersAndCars();
    } else if (window.location.pathname.includes('car-details.html')) {
        loadCarDetails();
    }

    // Reset filters button functionality
    const resetFiltersButton = document.getElementById('resetFilters');
    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', resetFilters);
    }

    // Apply filter changes immediately
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.querySelectorAll('select').forEach(element => {
            element.addEventListener('change', () => {
                updateSessionStorageFilters();
                fetchAllCars();
            });
        });
    }

    // Handle header scroll behavior
    handleScroll();
    window.addEventListener('scroll', handleScroll);
});

/* ==========================
   POPULAR CARS LOGIC
========================== */

// Load popular cars from session storage or fetch if not available
async function loadPopularCars() {
    try {
        const cachedCars = sessionStorage.getItem('popularCars');
        if (cachedCars) {
            displayPopularCars(JSON.parse(cachedCars));
        } else {
            await fetchAndCachePopularCars();
        }
    } catch (error) {
        console.error('Error loading popular cars:', error);
    }
}

// Fetch popular cars, cache them, and display
async function fetchAndCachePopularCars() {
    try {
        const cars = await fetchPopularCars();
        if (cars) {
            sessionStorage.setItem('popularCars', JSON.stringify(cars));
            displayPopularCars(cars);
        } else {
            throw new Error('Fetched popular cars data is invalid.');
        }
    } catch (error) {
        console.error('Error fetching popular cars:', error);
    }
}

// Display popular cars in the UI
function displayPopularCars(cars) {
    const carCardsContainer = document.getElementById('car-cards-container');
    const defaultImage = "https://picsum.photos/600/360?random";
    if (carCardsContainer) {
        carCardsContainer.innerHTML = '';
        if (cars.length > 0) {
            cars.forEach(car => {
                const carCard = document.createElement('a');
                carCard.href = `car-details.html?carId=${car.car_id}`;
                carCard.classList.add('block', 'border', 'bg-white', 'border-gray-300', 'rounded-lg', 'p-4', 'hover:shadow-lg');
                const imageUrl = car.image_url || defaultImage;
                carCard.innerHTML = `
                    <img src="${imageUrl}" alt="${car.manufacturer} ${car.model_name}" class="w-full h-auto rounded mb-4">
                    <h3 class="text-xl font-bold">${car.manufacturer} ${car.model_name}</h3>
                    <p class="text-gray-600">Fuel Type: ${car.fuel_type_name || 'N/A'}</p>
                    <p class="text-gray-600">Transmission: ${car.transmission_name || 'N/A'}</p>
                    <p class="text-gray-600">Drive: ${car.drive_type_name || 'N/A'}</p>
                    <p class="text-gray-600">Seats: ${car.seats || 'N/A'}</p>
                    <p class="text-gray-600">Status: ${car.status_name || 'N/A'}</p>
                    <p class="text-blue-500 font-bold">Price: ${car.price ? `${car.price} € per month` : 'N/A'}</p>
                `;
                carCardsContainer.appendChild(carCard);
            });
        } else {
            carCardsContainer.innerHTML = '<p class="text-red-500">No popular cars available at the moment.</p>';
        }
    } else {
        console.error("Car cards container element not found in the DOM.");
    }
}

/* ==========================
   FILTERS AND CARS LOGIC
========================== */

// Load filters and cars from session storage or fetch if not available
async function loadFiltersAndCars() {
    const filtersKey = 'filterValues';
    const carsKey = 'cars';
    const cachedFilters = sessionStorage.getItem(filtersKey);
    const cachedCars = sessionStorage.getItem(carsKey);

    try {
        if (cachedFilters && cachedCars) {
            const filters = JSON.parse(cachedFilters);
            applyFilters(filters);
            displayCars(JSON.parse(cachedCars));
        } else {
            await fetchFilters();
            const cars = await fetchAllCars();
            if (cars) {
                sessionStorage.setItem(carsKey, JSON.stringify(cars));
                displayCars(cars);
            }
        }
    } catch (error) {
        console.error("Error loading filters and cars:", error);
    }
}

// Update session storage with the current filter values
function updateSessionStorageFilters() {
    const filterValues = getFilterValues();
    sessionStorage.setItem('filterValues', JSON.stringify(filterValues));
}

// Get the current filter values from the form
function getFilterValues() {
    const filterForm = document.getElementById('filterForm');
    const filterValues = {};
    if (filterForm) {
        filterForm.querySelectorAll('select').forEach(element => {
            if (element.value) {
                filterValues[element.name] = element.value;
            }
        });
    }
    return filterValues;
}

// Display cars in the UI
function displayCars(cars) {
    const vehicleList = document.getElementById('vehicleList');
    const defaultImage = "https://picsum.photos/600/360?random=3";
    if (vehicleList) {
        vehicleList.innerHTML = ''; // Clear previous content
        if (cars.length > 0) {
            cars.forEach(car => {
                const carCard = document.createElement('a');
                carCard.href = `car-details.html?carId=${car.car_id}`;
                carCard.classList.add('block', 'border', 'bg-white', 'border-gray-300', 'rounded-lg', 'p-4', 'hover:shadow-lg');
                const imageUrl = car.images && car.images.length > 0 ? car.images[0] : defaultImage;
                carCard.innerHTML = `
                    <img src="${imageUrl}" alt="${car.manufacturer} ${car.model_name}" class="w-full h-auto rounded mb-4">
                    <h3 class="text-xl font-bold">${car.manufacturer} ${car.model_name}</h3>
                    <p class="text-gray-600">Fuel Type: ${car.fuel_type_name || 'N/A'}</p>
                    <p class="text-gray-600">Transmission: ${car.transmission_name || 'N/A'}</p>
                    <p class="text-gray-600">Drive: ${car.drive_type_name || 'N/A'}</p>
                    <p class="text-gray-600">Seats: ${car.seats || 'N/A'}</p>
                    <p class="text-gray-600">Status: ${car.status_name || 'N/A'}</p>
                    <p class="text-blue-500 font-bold">Price: ${car.price ? `${car.price} € per month` : 'N/A'}</p>
                `;
                vehicleList.appendChild(carCard);
            });
        } else {
            vehicleList.innerHTML = '<p class="text-red-500">No cars available at the moment. Please try different filters.</p>';
        }
    } else {
        console.error("Vehicle list element not found in the DOM.");
    }
}

/* ==========================
   CAR DETAILS LOGIC
========================== */

// Load car details from session storage or fetch if not available
async function loadCarDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('carId');

    if (!carId) {
        showError('Car ID not found in the URL.');
        return;
    }

    const cachedCarData = sessionStorage.getItem(`carDetails_${carId}`);
    let carData;

    if (cachedCarData) {
        carData = JSON.parse(cachedCarData);
    } else {
        carData = await fetchCarDetailsAndOptions(carId);
        if (carData) {
            sessionStorage.setItem(`carDetails_${carId}`, JSON.stringify(carData));
        } else {
            showError('Failed to load car details. Please try again later.');
            return;
        }
    }

    populateCarDetails(carData);
    populateSubscriptionOptions(carData);
}

// Populate car details in the UI
function populateCarDetails(car) {
    document.getElementById('car-title').textContent = `${car.manufacturer} ${car.model_name}`;

    const carImagesContainer = document.getElementById('car-images');
    carImagesContainer.innerHTML = car.images.map(image => `
        <img src="${image}" alt="${car.model_name}" class="h-auto max-w-full rounded bg-cover mb-4">
    `).join('');

    const technicalData = document.getElementById('technical-data');
    technicalData.innerHTML = `
        <p>Transmission: ${car.transmission_name || 'N/A'}</p>
        <p>Drive: ${car.drive_type_name || 'N/A'}</p>
        <p>Fuel Type: ${car.fuel_type_name || 'N/A'}</p>
        <p>Horse Power: ${car.horse_power || 'N/A'}</p>
        <p>Seats: ${car.seats || 'N/A'}</p>
    `;

    const environmentData = document.getElementById('environment-data');
    environmentData.innerHTML = `
        <p>Fuel Consumption: ${car.fuel_consumption || 'N/A'} L/100km</p>
        <p>CO2 Emissions: ${car.co2_emissions || 'N/A'} g/km</p>
    `;

    populateDetailsList('basis-details', car.config_basis);
    populateDetailsList('safety-details', car.config_safety);
    populateDetailsList('entertainment-details', car.config_entertainment);
    populateDetailsList('comfort-details', car.config_comfort);
}

// Populate subscription options in the UI
function populateSubscriptionOptions(car) {
    document.getElementById('mileage-plan').textContent = car.subscription_options.mileage_plan || 'N/A';
    document.getElementById('car-insurance').textContent = `${car.subscription_options.insurance_package || 'N/A'} €`;
    document.getElementById('admin-fee').textContent = `${car.subscription_options.administration_fee || 'N/A'} €`;
    document.getElementById('first-payment').textContent = `${car.subscription_options.deposit || 'N/A'} €`;
    document.getElementById('monthly-fee').textContent = `${car.subscription_options.monthly_payment || 'N/A'} € per month`;
}

// Helper to populate car detail lists (basis, safety, etc.)
function populateDetailsList(elementId, items) {
    const element = document.getElementById(elementId);
    element.innerHTML = items.length > 0 ? items.map(item => `<li>${item}</li>`).join('') : '<li>No data available</li>';
}

// Display an error message on the car details page
function showError(message) {
    const errorContainer = document.createElement('div');
    errorContainer.classList.add('bg-red-500', 'text-white', 'p-4', 'rounded', 'mb-4');
    errorContainer.textContent = message;
    document.body.prepend(errorContainer);
}

/* ==========================
   MISCELLANEOUS LOGIC
========================== */

// Handle header behavior on scroll
function handleScroll() {
    const header = document.getElementById('top-menu');
    const logoText = document.getElementById('logo-text');
    const navLinks = document.getElementById('nav-links').getElementsByTagName('a');
    const menuLinks = document.getElementById('menu-links').getElementsByTagName('a');

    if (header && logoText && navLinks.length > 0 && menuLinks.length > 0) {
        if (window.scrollY > 50) {
            header.classList.add('bg-white');
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
}

// Reset filters to default values
function resetFilters() {
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.reset();
    }
    sessionStorage.removeItem('filterValues');
    fetchAllCars(); // Refresh car list with default filters
}
