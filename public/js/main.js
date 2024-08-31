/// src/public/js/main.js

// Import necessary functions from other modules
import { fetchPopularCars } from './fetchPopularCars.js';
import { fetchAllCars } from './fetchAllCars.js';
import { fetchFilters } from './fetchFilters.js';
import { fetchCarDetails } from './fetchCarDetails.js';
import { fetchSubscriptionOptions } from './fetchSubscriptionOptions.js';

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");
    setupEventListeners();  // Set up event listeners when the DOM is fully loaded
});

function setupEventListeners() {
    console.log("Setting up event listeners...");
    
    try {
        // Clear session storage on load to prevent old data issues
        sessionStorage.removeItem('popularCars');
        sessionStorage.removeItem('cars');
        sessionStorage.removeItem('carDetails');
        sessionStorage.removeItem('subscriptionOptions');

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
            console.log("Popular cars section detected.");
            loadPopularCars();
        } else if (document.getElementById('vehicleList')) {
            console.log("Vehicle list section detected.");
            loadFiltersAndCars();
        } else if (window.location.pathname.includes('car-details.html')) {
            console.log("Car details page detected.");
            loadCarDetails();  // Car details page

            // Attach the start subscription button event listener
            const startSubscriptionButton = document.getElementById('startSubscriptionButton');
            if (startSubscriptionButton) {
                startSubscriptionButton.addEventListener('click', saveSubscriptionOptions);
            } else {
                console.error("Start Subscription button not found on car-details.html.");
            }
        } else if (window.location.pathname.includes('personal_data.html')) {
            console.log("Personal data page detected.");
            populateOrderOverview();  // Personal data page

            // Attach the save personal info button event listener
            const saveButton = document.getElementById('save-personal-info');
            if (saveButton) {
                saveButton.addEventListener('click', savePersonalInfo);
            } else {
                console.error("Save Personal Info button not found on personal_data.html.");
            }
        } else if (window.location.pathname.includes('payment.html')) {
            console.log("Payment page detected.");
            populatePaymentPage();  // Handle the payment page initialization

            // No need to attach event listener here. Let stripe.js handle it.
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
    } catch (error) {
        console.error("An error occurred during event listener setup:", error);
    }
}

// Ensure the saveSubscriptionOptions function is globally available
window.saveSubscriptionOptions = saveSubscriptionOptions;


/* ==========================
   POPULAR CARS LOGIC
========================== */

// Load popular cars from session storage or fetch if not available
async function loadPopularCars() {
    try {
        const cachedCars = sessionStorage.getItem('popularCars');
        if (cachedCars) {
            const parsedCars = JSON.parse(cachedCars);
            if (Array.isArray(parsedCars) && parsedCars.length > 0) {
                console.log('Using cached popular cars:', parsedCars);
                displayPopularCars(parsedCars);
            } else {
                console.warn('Cached popular cars data is invalid, refetching from server...');
                await fetchAndCachePopularCars();
            }
        } else {
            console.log('No cached popular cars found, fetching from server...');
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
        console.log('Fetched popular cars:', cars);

        if (Array.isArray(cars) && cars.length > 0) {
            sessionStorage.setItem('popularCars', JSON.stringify(cars));
            console.log('Popular cars cached successfully');
            displayPopularCars(cars);
        } else {
            throw new Error('Fetched popular cars data is invalid or empty.');
        }
    } catch (error) {
        console.error('Error fetching popular cars:', error);
    }
}

/* ==========================
   POPULAR CAR DISPLAY LOGIC
========================== */
// This function is responsible for displaying popular cars in the UI
function displayPopularCars(cars) {
    const carCardsContainer = document.getElementById('car-cards-container');
    const defaultImage = "https://picsum.photos/600/360?random";
    if (carCardsContainer) {
        carCardsContainer.innerHTML = '';
if (cars.length > 0) {
    cars.forEach(car => {
        const carCard = document.createElement('a');
        carCard.href = `car-details.html?carId=${car.car_id}`;
        carCard.classList.add('block', 'border', 'bg-white', 'border-gray-300', 'rounded-lg', 'hover:shadow-lg', 'transition-shadow', 'duration-200');

        // Use car.image_url from the database, with fallback to defaultImage
        const imageUrl = car.image_url ? car.image_url : defaultImage;

        carCard.innerHTML = `
<div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
    <!-- Header: Special Badge and Carousel -->

    <div class="relative w-full h-64 bg-gray-100">

        <!-- Special Badge -->
        <div class="vehicle-tile__top">
            <div class="vehicle-tile__badge-wrapper">
                <span class="vehicle-tile__badge">Special deal</span>
            </div>
        </div>

        <!-- Carousel -->
        <div id="carousel" class="relative w-full">
            <div class="carousel-inner relative overflow-hidden w-full">
                <!-- Active Carousel Item -->
                <div class="carousel-item active relative float-left w-full">
                    <img src="${imageUrl}" alt="${car.manufacturer} ${car.model_name}" class="w-full h-auto object-cover data-twe-ripple-init">
                </div>
            </div>
        </div>

    </div>

    <!-- Body: Car Title, Details, and Pricing -->
    <div class="p-4 flex-grow flex flex-col">
        <!-- Car Title -->
        <h3 class="text-lg md:text-xl font-bold mb-2">${car.manufacturer} ${car.model_name}</h3>

        <!-- Car Details Section -->
        <div class="text-gray-600 text-xxs font-light md:text-xs flex flex-wrap space-x-1 md:space-x-2 mb-4">
            <span>${car.fuel_type_name || 'N/A'}</span>
            <span>|</span>
            <span>${car.transmission_name || 'N/A'}</span>
            <span>|</span>
            <span>${car.drive_type_name || 'N/A'}</span>
        </div>

        <!-- Price Section -->
        <div class="text-gray-600 text-xs md:text-sm text-right">
            <span class="align-top">from</span>
            <span class="text-lg md:text-xl font-bold text-blue-900 align-middle">${car.price ? `${car.price}.` : 'N/A'}</span>
            <span class="text-lg md:text-xl text-blue-900 align-baseline">–</span>
            <span class="text-xs md:text-sm text-gray-600 align-baseline">/mo.</span>
        </div>
    </div>

    <!-- Footer: Availability Badge -->
    <div class="bg-gray-100 text-center text-red-600 text-sm font-bold py-2 rounded-b-lg mt-auto">
        Available from ${car.availability_date || 'TBA'}
    </div>
</div>
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
   CAR DISPLAY LOGIC
========================== */
// This function is responsible for displaying cars in the UI
function displayCars(cars) {
    console.log(cars); // Check if price is available here
    const vehicleList = document.getElementById('vehicleList');
    const defaultImage = "https://picsum.photos/600/360?random=3"; // Fallback image URL

    if (vehicleList) {
        vehicleList.innerHTML = ''; // Clear previous content



if (cars.length > 0) {
    cars.forEach(car => {
        const carCard = document.createElement('a');
        carCard.href = `car-details.html?carId=${car.car_id}`;
        carCard.classList.add('block', 'border', 'bg-white', 'border-gray-300', 'rounded-lg', 'hover:shadow-lg', 'transition-shadow', 'duration-200');

        // Use car.image_url from the database, with fallback to defaultImage
        const imageUrl = car.image_url ? car.image_url : defaultImage;

        carCard.innerHTML = `
<div class="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
    <!-- Header: Special Badge and Carousel -->
   

    <div class="relative w-full h-64 bg-gray-100">


    <!-- Special Badge -->
    <div class="vehicle-tile__top">
        <div class="vehicle-tile__badge-wrapper">
            <span class="vehicle-tile__badge">Special deal</span>
        </div>
    </div>


        <!-- Carousel -->
        <div id="carousel" class="relative w-full">
            <div class="carousel-inner relative overflow-hidden w-full">
                <!-- Active Carousel Item -->
                <div class="carousel-item active relative float-left w-full">
                    <img src="${imageUrl}" alt="${car.manufacturer} ${car.model_name}" class="w-full h-auto object-cover data-twe-ripple-init">
                </div>
            </div>
        </div>

    </div>

    <!-- Body: Car Title, Details, and Pricing -->
    <div class="p-4 flex-grow flex flex-col">
        <!-- Car Title -->
        <h3 class="text-lg md:text-xl font-bold mb-2">${car.manufacturer} ${car.model_name}</h3>

        <!-- Car Details Section -->
        <div class="text-gray-600 text-xxs font-light md:text-xs flex flex-wrap space-x-1 md:space-x-2 mb-4">
            <span>${car.fuel_type_name || 'N/A'}</span>
            <span>|</span>
            <span>${car.transmission_name || 'N/A'}</span>
            <span>|</span>
            <span>${car.drive_type_name || 'N/A'}</span>
        </div>

        <!-- Price Section -->
        <div class="text-gray-600 text-xs md:text-sm text-right">
            <span class="align-top">from</span>
            <span class="text-lg md:text-xl font-bold text-blue-900 align-middle">${car.price ? `${car.price}.` : 'N/A'}</span>
            <span class="text-lg md:text-xl text-blue-900 align-baseline">–</span>
            <span class="text-xs md:text-sm text-gray-600 align-baseline">/mo.</span>
        </div>
    </div>

    <!-- Footer: Availability Badge -->
    <div class="bg-gray-100 text-center text-red-600 text-sm font-bold py-2 rounded-b-lg mt-auto">
        Available from ${car.availability_date || 'TBA'}
    </div>
</div>



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


/* ==========================
   CAR DETAILS LOGIC
========================== */

async function loadCarDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const carId = urlParams.get('carId');

    if (!carId) {
        console.error('Car ID not found in the URL.');
        return;
    }

    // Store carId in sessionStorage for later use
    sessionStorage.setItem('selectedCarId', carId);

    // Fetch car details
    const carData = await fetchCarDetails(carId);
    if (carData) {
        // Store car details in sessionStorage
        sessionStorage.setItem(`carDetails_${carId}`, JSON.stringify(carData));
        populateCarDetails(carData);
    } else {
        console.error('Failed to load car details.');
        return;
    }

    // Fetch and populate subscription options with carId
    try {
        const subscriptionOptions = await fetchSubscriptionOptions(carId);
        console.log('Subscription options received:', subscriptionOptions);

        if (subscriptionOptions && Array.isArray(subscriptionOptions.pricing) && subscriptionOptions.pricing.length > 0) {
            const defaultPricing = subscriptionOptions.pricing[0];
            console.log('Default pricing found:', defaultPricing);
            updatePricingUI(defaultPricing);
        } else {
            console.error('No valid pricing data found.');
            updatePricingUI(null); // Pass null to trigger fallback
        }

        populateSubscriptionOptions(subscriptionOptions);
    } catch (error) {
        console.error('Error loading car details:', error.message);
    }
}


/* ==========================
   populateCarDetails LOGIC
========================== */

function populateCarDetails(car) {
    const defaultImage = "https://picsum.photos/600/360?random=3"; // Default image URL

    if (!car) {
        console.error('Car data is missing.');
        showError('Failed to load car details. Please try again later.');
        return;
    }

    // Set car title and description
    const carTitle = document.getElementById('car-title');
    if (carTitle) {
        carTitle.textContent = `${car.manufacturer} ${car.model_name}`;
    }

    const carDescription = document.getElementById('car-description');
    if (carDescription) {
        carDescription.textContent = car.description || 'No description available.';
    }

    // Set car images with fallback to default image
    const carImagesContainer = document.getElementById('car-images-new');
    if (carImagesContainer) {
        // Ensure car.images is an array and has at least three images
        const imageUrls = Array.isArray(car.images) && car.images.length >= 3
            ? car.images
            : [defaultImage, defaultImage, defaultImage]; // Ensure at least three images

        console.log('Image URLs:', imageUrls); // Debug to check the URLs

        // Update the large main image
        const mainImage = document.getElementById('image-large-new');
        if (mainImage) {
            mainImage.src = imageUrls[0];
            mainImage.alt = car.model_name;
        }

        // Update the smaller images
        const smallImage1 = document.getElementById('image-small-1-new');
        if (smallImage1) {
            smallImage1.src = imageUrls[1];
            smallImage1.alt = car.model_name;
        }

        const smallImage2 = document.getElementById('image-small-2-new');
        if (smallImage2) {
            smallImage2.src = imageUrls[2];
            smallImage2.alt = car.model_name;
        }
    }


    // Populate technical data
    const technicalData = document.getElementById('technical-data');
    if (technicalData) {
        technicalData.innerHTML = `
            <p>Color: ${car.color || 'N/A'}</p>
            <p>Trailer Hitch: ${car.trailer_hitch ? 'Yes' : 'No'}</p>
            <p>Transmission: ${car.transmission_name || 'N/A'}</p>
            <p>Drive: ${car.drive_type_name || 'N/A'}</p>
            <p>Fuel Type: ${car.fuel_type_name || 'N/A'}</p>
            <p>Seats: ${car.seats || 'N/A'}</p>
            <p>Doors: ${car.doors || 'N/A'}</p>
            <p>Vehicle Type: ${car.vehicle_type_name || 'N/A'}</p>
        `;
    }

    // Populate environment data based on whether the car is electric or fuel-based
    const environmentData = document.getElementById('environment-data');
    if (environmentData) {
        if (car.is_electric) {
            environmentData.innerHTML = `
                <p>Battery Capacity: ${car.battery_capacity || 'N/A'} kWh</p>
                <p>Max Charging: ${car.max_charging || 'N/A'} kW</p>
            `;
        } else {
            environmentData.innerHTML = `
                <p>Fuel Tank Capacity: ${car.fuel_tank_capacity || 'N/A'} liters</p>
                <p>Fuel Consumption: ${car.fuel_consumption || 'N/A'} L/100km</p>
                <p>Horse Power: ${car.horse_power || 'N/A'} HP</p>
                <p>Engine Size: ${car.engine_size || 'N/A'} L</p>
                <p>CO2 Emissions: ${car.co2_emissions || 'N/A'} g/km</p>
            `;
        }
    }

    // Populate other details
    populateDetailsList('basis-details', car.config_basis || []);
    populateDetailsList('safety-details', car.config_safety || []);
    populateDetailsList('entertainment-details', car.config_entertainment || []);
    populateDetailsList('comfort-details', car.config_comfort || []);
}

function populateDetailsList(elementId, items) {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = items.length > 0
            ? items.map(item => `<li>${item}</li>`).join('')
            : '<li>No data available</li>';
    } else {
        console.error(`Element with ID ${elementId} not found.`);
    }
}

function populateMileagePlans(mileagePlans) {
    const mileageSelect = document.getElementById('mileagePlans');
    mileageSelect.innerHTML = ''; // Clear existing options

    mileagePlans.forEach(plan => {
        const option = document.createElement('option');
        option.value = plan.plan_id;
        option.textContent = `${plan.kilometers} KM`;
        if (plan.price_modifier > 0) {
            option.textContent += ` (+${plan.price_modifier} CHF)`;
        }
        mileageSelect.appendChild(option);
    });
}

function populateSubscriptionDurations(durations) {
    const durationSelect = document.getElementById('subscriptionDurations');
    durationSelect.innerHTML = ''; // Clear existing options

    durations.forEach(duration => {
        const option = document.createElement('option');
        option.value = duration.duration_id;
        option.textContent = `Min. ${duration.months} Months`;
        if (duration.price_modifier > 0) {
            option.textContent += ` (+${duration.price_modifier} €)`;
        }
        durationSelect.appendChild(option);
    });
}

function populateInsurancePackages(packages) {
    const insuranceSelect = document.getElementById('insurancePackages');
    insuranceSelect.innerHTML = ''; // Clear existing options

    packages.forEach(pkg => {
        const option = document.createElement('option');
        option.value = pkg.insurance_package_id;
        option.textContent = `${pkg.package_name}`;
        if (pkg.price_modifier > 0) {
            option.textContent += ` (+${pkg.price_modifier} CHF)`;
        }
        insuranceSelect.appendChild(option);
    });
}

/* ==========================
   SUBSCRIPTION LOGIC
========================== */

async function populateSubscriptionOptions(options) {
    if (!options) {
        console.error('Subscription options data is missing.');
        return;
    }

    // Store options in session storage for future use
    sessionStorage.setItem('subscriptionOptions', JSON.stringify(options));

    // Populate color options
    const colorSelect = document.getElementById('color');
    if (colorSelect && options.colors) {
        colorSelect.innerHTML = '';
        options.colors.forEach(color => {
            const opt = document.createElement('option');
            opt.value = color.color_name;
            opt.textContent = color.color_name;
            colorSelect.appendChild(opt);
        });
    }

    // Populate package type options
    const packageTypeSelect = document.getElementById('packageType');
    if (packageTypeSelect && options.packageTypes) {
        packageTypeSelect.innerHTML = '';
        options.packageTypes.forEach(packageType => {
            const opt = document.createElement('option');
            opt.value = packageType.package_type_id;
            const priceModifierText = packageType.price_modifier > 0 
                ? ` (+${packageType.price_modifier} €)` 
                : '';
            opt.textContent = `${packageType.package_name}${priceModifierText}`;
            packageTypeSelect.appendChild(opt);
        });

        // Add event listener to update pricing when package type changes
        packageTypeSelect.addEventListener('change', calculatePricing);
    }

    // Populate subscription duration options
    const minTermSelect = document.getElementById('minTerm');
    if (minTermSelect && options.subscriptionDurations) {
        minTermSelect.innerHTML = '';
        options.subscriptionDurations.forEach(duration => {
            const opt = document.createElement('option');
            opt.value = duration.duration_id;
            const priceModifierText = duration.price_modifier > 0 
                ? ` (+${duration.price_modifier} €)` 
                : '';
            opt.textContent = `${duration.months} months${priceModifierText}`;
            minTermSelect.appendChild(opt);
        });

        // Add event listener to update pricing when subscription duration changes
        minTermSelect.addEventListener('change', calculatePricing);
    }

    // Populate mileage plans
    const mileagePlansSelect = document.getElementById('mileagePlans');
    if (mileagePlansSelect && options.mileagePlans) {
        mileagePlansSelect.innerHTML = '';
        options.mileagePlans.forEach(plan => {
            console.log('Mileage Plan:', plan); // Log the entire plan object

            const opt = document.createElement('option');
            opt.value = plan.plan_id;

            // Ensure price_modifier is treated as a number
            const priceModifier = parseFloat(plan.price_modifier);
            const priceModifierText = priceModifier > 0 
                ? ` (+${priceModifier} €)` 
                : '';

            opt.textContent = `${plan.kilometers} km/month${priceModifierText}`;
            mileagePlansSelect.appendChild(opt);
        });

        // Add event listener to update pricing when mileage plan changes
        mileagePlansSelect.addEventListener('change', calculatePricing);
    }

    // Populate insurance packages
    const insurancePackagesSelect = document.getElementById('insurancePackages');
    if (insurancePackagesSelect && options.insurancePackages) {
        insurancePackagesSelect.innerHTML = '';
        options.insurancePackages.forEach(insurancePkg => {
            const opt = document.createElement('option');
            opt.value = insurancePkg.insurance_package_id;
            const priceModifierText = insurancePkg.price_modifier > 0 
                ? ` (+${insurancePkg.price_modifier} €)` 
                : '';
            opt.textContent = `${insurancePkg.package_name}${priceModifierText}`;
            insurancePackagesSelect.appendChild(opt);
        });

        // Add event listener to update pricing when insurance package changes
        insurancePackagesSelect.addEventListener('change', calculatePricing);
    }

    // Populate delivery or pickup options
    const deliverySelect = document.getElementById('delivery');
    if (deliverySelect && options.deliveryOptions) {
        deliverySelect.innerHTML = '';
        options.deliveryOptions.forEach(deliveryOption => {
            const opt = document.createElement('option');
            opt.value = deliveryOption.option_id;
            const priceModifierText = deliveryOption.price_modifier > 0 
                ? ` (+${deliveryOption.price_modifier} €)` 
                : '';
            opt.textContent = `${deliveryOption.option_name}${priceModifierText}`;
            deliverySelect.appendChild(opt);
        });
    }

    // Calculate and display the fees
    calculatePricing(); // Call unified function
}

/* ==========================
   PRICING LOGIC
========================== */

function calculatePricing() {
    const options = JSON.parse(sessionStorage.getItem('subscriptionOptions'));

    if (!options) {
        console.error('No subscription options found in session storage.');
        return;
    }

    // Get selected values
    const packageTypeElement = document.getElementById('packageType');
    const minTermElement = document.getElementById('minTerm');
    const mileagePlansElement = document.getElementById('mileagePlans');
    const insurancePackagesElement = document.getElementById('insurancePackages');

    if (!packageTypeElement || !minTermElement || !mileagePlansElement || !insurancePackagesElement) {
        console.error('One or more select elements are missing.');
        return;
    }

    const packageType = packageTypeElement.selectedOptions[0]?.text.split(' ')[0];
    const durationMonths = parseInt(minTermElement.selectedOptions[0]?.text.split(' ')[0], 10);
    const kilometers = parseInt(mileagePlansElement.selectedOptions[0]?.text.split(' ')[0], 10);
    const insurancePackage = insurancePackagesElement.selectedOptions[0]?.text.split(' ')[0];

    if (!packageType || isNaN(durationMonths) || isNaN(kilometers) || !insurancePackage) {
        console.error('One or more selected values are invalid.');
        return;
    }

    console.log("Selected values:", {
        packageType,
        durationMonths,
        kilometers,
        insurancePackage
    });

    // Calculate the final price based on the base price and modifiers
    const basePrice = parseFloat(options.pricing[0]?.price) || 0;
    const packageTypeModifier = parseFloat(options.packageTypes.find(pt => pt.package_name === packageType)?.price_modifier) || 0;
    const durationModifier = parseFloat(options.subscriptionDurations.find(d => d.months === durationMonths)?.price_modifier) || 0;
    const kilometersModifier = parseFloat(options.mileagePlans.find(mp => mp.kilometers === kilometers)?.price_modifier) || 0;
    const insuranceModifier = parseFloat(options.insurancePackages.find(ip => ip.package_name === insurancePackage)?.price_modifier) || 0;

    const finalPrice = basePrice + packageTypeModifier + durationModifier + kilometersModifier + insuranceModifier;

    console.log('Calculated final price:', finalPrice);

    // Update the UI with the calculated price
    updatePricingUI({
        price: finalPrice.toFixed(2),
        deposit: options.pricing[0]?.deposit || 'N/A',
        administration_fee: options.pricing[0]?.administration_fee || 'N/A',
        excess_mileage_fee: options.pricing[0]?.excess_mileage_fee || 'N/A'
    });
}



/* ==========================
   Update Pricing UI Logic
========================== */

function updatePricingUI(pricing) {
    try {
        if (pricing) {
            document.getElementById('monthlyFee').textContent = `${pricing.price} €`;
            document.getElementById('deposit').textContent = `${pricing.deposit} €`;
            document.getElementById('adminFee').textContent = `${pricing.administration_fee} €`;
            document.getElementById('excessMileageFee').textContent = `${pricing.excess_mileage_fee} €/km`;
        } else {
            console.warn('Pricing data is not available. Displaying fallback values.');
            document.getElementById('monthlyFee').textContent = 'N/A';
            document.getElementById('deposit').textContent = 'N/A';
            document.getElementById('adminFee').textContent = 'N/A';
            document.getElementById('excessMileageFee').textContent = 'N/A';
        }
    } catch (error) {
        console.error('Error updating pricing UI:', error.message);
    }
}

/* ==========================
   SAVE SUBSCRIPTION LOGIC
========================== */

function saveSubscriptionOptions() {
    const carId = sessionStorage.getItem('selectedCarId');
    const carDetails = JSON.parse(sessionStorage.getItem(`carDetails_${carId}`));

    if (!carId || !carDetails) {
        console.error('Car ID or car details are missing.');
        return;
    }

    const selectedDurationId = document.getElementById('minTerm').value;
    const selectedMileagePlanId = document.getElementById('mileagePlans').value;
    const selectedInsurancePackageId = document.getElementById('insurancePackages').value;
    const selectedDeliveryOptionId = document.getElementById('delivery').value;

    const selectedSubscriptionData = {
        carId: carId,
        carDetails: carDetails,
        subscriptionOptions: JSON.parse(sessionStorage.getItem('subscriptionOptions')),
        selectedDurationId: selectedDurationId,
        selectedMileagePlanId: selectedMileagePlanId,
        selectedInsurancePackageId: selectedInsurancePackageId,
        selectedDeliveryOptionId: selectedDeliveryOptionId,
        calculatedPricing: {
            monthlyFee: document.getElementById('monthlyFee').textContent,
            deposit: document.getElementById('deposit').textContent,
            adminFee: document.getElementById('adminFee').textContent,
            excessMileageFee: document.getElementById('excessMileageFee').textContent
        }
    };

    sessionStorage.setItem('selectedSubscription', JSON.stringify(selectedSubscriptionData));

    // Redirect to personal_data.html
    window.location.href = 'personal_data.html';
}



/* ==========================
   POPULATE ORDER LOGIC
========================== */

function populateOrderOverview() {
    const savedSubscription = JSON.parse(sessionStorage.getItem('selectedSubscription'));

    if (savedSubscription) {
        // Populate car image
        const carImageElement = document.getElementById('carImage');
        if (carImageElement) {
            const carImages = savedSubscription.carDetails?.images;
            carImageElement.src = Array.isArray(carImages) && carImages.length > 0 ? carImages[0] : 'https://picsum.photos/600/360?random=3';
        }

        // Populate car model and manufacturer
        const carModelElement = document.getElementById('carModel');
        if (carModelElement) {
            carModelElement.textContent = `${savedSubscription.carDetails.manufacturer} ${savedSubscription.carDetails.model_name}`;
        }

        const carManufacturerElement = document.getElementById('carManufacturer');
        if (carManufacturerElement) {
            carManufacturerElement.textContent = savedSubscription.carDetails.manufacturer;
        }

        // Populate subscription details
        const selectedDuration = savedSubscription.subscriptionOptions.subscriptionDurations.find(duration => duration.duration_id === parseInt(savedSubscription.selectedDurationId, 10));
        const selectedMileagePlan = savedSubscription.subscriptionOptions.mileagePlans.find(plan => plan.plan_id === parseInt(savedSubscription.selectedMileagePlanId, 10));
        const selectedInsurancePackage = savedSubscription.subscriptionOptions.insurancePackages.find(pkg => pkg.insurance_package_id === parseInt(savedSubscription.selectedInsurancePackageId, 10));
        const selectedDeliveryOption = savedSubscription.subscriptionOptions.deliveryOptions.find(option => option.option_id === parseInt(savedSubscription.selectedDeliveryOptionId, 10));

        const minTermElement = document.getElementById('minTerm');
        if (minTermElement) {
            minTermElement.textContent = selectedDuration ? `${selectedDuration.months} months` : 'Not specified';
        }

        const mileagePlansElement = document.getElementById('mileagePlans');
        if (mileagePlansElement) {
            mileagePlansElement.textContent = selectedMileagePlan ? `${selectedMileagePlan.kilometers} km/month` : 'Not specified';
        }

        const insurancePackagesElement = document.getElementById('insurancePackages');
        if (insurancePackagesElement) {
            insurancePackagesElement.textContent = selectedInsurancePackage ? selectedInsurancePackage.package_name : 'Not specified';
        }

        const deliveryElement = document.getElementById('delivery');
        if (deliveryElement) {
            deliveryElement.textContent = selectedDeliveryOption ? selectedDeliveryOption.option_name : 'Not specified';
        }

        // Populate pricing details
        const adminFeeElement = document.getElementById('adminFee');
        if (adminFeeElement) {
            adminFeeElement.textContent = savedSubscription.calculatedPricing.adminFee;
        }

        const depositElement = document.getElementById('deposit');
        if (depositElement) {
            depositElement.textContent = savedSubscription.calculatedPricing.deposit;
        }

        const monthlyFeeElement = document.getElementById('monthlyFee');
        if (monthlyFeeElement) {
            monthlyFeeElement.textContent = savedSubscription.calculatedPricing.monthlyFee;
        }
    } else {
        console.error('No subscription data found in session storage.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    if (window.location.pathname.includes('personal_data.html')) {
        populateOrderOverview();
    }
});


/* ==========================
   SAVE PERSONAL INFO  LOGIC
========================== */

function savePersonalInfo() {
    const personalData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        birthdate: document.getElementById('birthdate').value,
        residenceStatus: document.getElementById('residenceStatus').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        postalCode: document.getElementById('postalCode').value,
        country: document.getElementById('country').value
    };

    if (!personalData.firstName || !personalData.lastName || !personalData.email) {
        alert('Please fill in all required fields.');
        return;
    }

    sessionStorage.setItem('personalData', JSON.stringify(personalData));
    window.location.href = 'payment.html';
}


/* ==========================
   PAYMENT LOGIC
========================== */

async function populatePaymentPage() {
    const savedSubscription = JSON.parse(sessionStorage.getItem('selectedSubscription'));
    const savedPersonalInfo = JSON.parse(sessionStorage.getItem('personalData'));

    if (savedSubscription && savedPersonalInfo) {
        // Populate car details
        const carDetails = savedSubscription.carDetails;

        const setTextContent = (id, content) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = content;
            } else {
                console.error(`Element with ID '${id}' not found`);
            }
        };

        // Populate car details section
        setTextContent('car-title', `${carDetails.manufacturer} ${carDetails.model_name}`);
        setTextContent('car-type', carDetails.vehicle_type_name || 'N/A');
        setTextContent('preferred-color', carDetails.color);
        setTextContent('transmission', carDetails.transmission_name);
        setTextContent('cost-extra-km', savedSubscription.calculatedPricing.excessMileageFee);
        setTextContent('admin-fee', savedSubscription.calculatedPricing.adminFee);
        setTextContent('first-payment', savedSubscription.calculatedPricing.deposit);
        setTextContent('monthly-price', `${savedSubscription.calculatedPricing.monthlyFee} €`); // Total Monthly Subscription

        // Retrieve and set formatted values for subscription details
        const selectedDuration = savedSubscription.subscriptionOptions.subscriptionDurations.find(duration => duration.duration_id === parseInt(savedSubscription.selectedDurationId, 10));
        const selectedMileagePlan = savedSubscription.subscriptionOptions.mileagePlans.find(plan => plan.plan_id === parseInt(savedSubscription.selectedMileagePlanId, 10));
        const selectedInsurancePackage = savedSubscription.subscriptionOptions.insurancePackages.find(pkg => pkg.insurance_package_id === parseInt(savedSubscription.selectedInsurancePackageId, 10));
        const selectedDeliveryOption = savedSubscription.subscriptionOptions.deliveryOptions.find(option => option.option_id === parseInt(savedSubscription.selectedDeliveryOptionId, 10));

        setTextContent('subscription-duration', selectedDuration ? `${selectedDuration.months} months` : 'Not specified');
        setTextContent('kilometer-options', selectedMileagePlan ? `${selectedMileagePlan.kilometers} km/month` : 'Not specified');
        setTextContent('insurance-package', selectedInsurancePackage ? selectedInsurancePackage.package_name : 'Not specified');
        setTextContent('delivery', selectedDeliveryOption ? selectedDeliveryOption.option_name : 'Not specified');

        // Populate personal information section
        const setValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = value || '';
            } else {
                console.error(`Element with ID '${id}' not found`);
            }
        };

        const formatDateOfBirth = (dateString) => {
            const date = new Date(dateString);
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        setValue('firstName', savedPersonalInfo.firstName);
        setValue('lastName', savedPersonalInfo.lastName);
        setValue('email', savedPersonalInfo.email);
        setValue('phone', savedPersonalInfo.phone);
        setValue('birthdate', formatDateOfBirth(savedPersonalInfo.birthdate));
        setValue('residenceStatus', savedPersonalInfo.residenceStatus);
        setValue('address', savedPersonalInfo.address);
        setValue('city', savedPersonalInfo.city);
        setValue('postalCode', savedPersonalInfo.postalCode);
        setValue('country', savedPersonalInfo.country);

        // Load car images
        if (carDetails.images && carDetails.images.length > 0) {
            const largeImage = document.getElementById('image-large-new');
            const smallImage1 = document.getElementById('image-small-1-new');
            const smallImage2 = document.getElementById('image-small-2-new');

            if (largeImage) largeImage.src = carDetails.images[0] || 'https://picsum.photos/800/600?random=1';
            if (smallImage1) smallImage1.src = carDetails.images[1] || 'https://picsum.photos/400/300?random=2';
            if (smallImage2) smallImage2.src = carDetails.images[2] || 'https://picsum.photos/400/300?random=3';
        }

        // Calculate the amount in cents
        const monthlyFeeInCents = parseFloat(savedSubscription.calculatedPricing.monthlyFee) * 100; // Convert EUR to cents

        // Display the subscription amount on the page
        const subscriptionAmount = `${savedSubscription.calculatedPricing.monthlyFee} €`;
        document.getElementById('subscription-amount').textContent = subscriptionAmount;

        // Handle Stripe Payment
        createPaymentIntent(monthlyFeeInCents, savedPersonalInfo);
    } else {
        console.error('No subscription or personal information found in session storage.');
    }
}

// /* ==========================
//    PAYMENT INTENT LOGIC 
// ========================== */

// // Create Payment Intent with Stripe
// async function createPaymentIntent(amount, personalInfo) {
//     try {
//         const response = await fetch('/create-payment-intent', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ amount })
//         });

//         const { clientSecret } = await response.json();

//         const stripe = Stripe('pk_test_7WLRdJPqXCD1EYQmZW3xCzKJ00Ivo5YzjO');
//         const elements = stripe.elements();
//         const cardElement = elements.create('card');
//         let isCardElementMounted = false;

//         // Mount only if not already mounted
//         if (!isCardElementMounted) {
//             cardElement.mount('#card-element');
//             isCardElementMounted = true;
//         }

//         const form = document.getElementById('payment-form');
//         form.addEventListener('submit', async (event) => {
//             event.preventDefault();

//             // Ensure the element is still mounted and available in the DOM
//             if (!isCardElementMounted || !document.getElementById('card-element')) {
//                 console.error('Card Element is not properly mounted.');
//                 return;
//             }

//             // Convert country name to ISO alpha-2 code
//             const countryCodes = {
//                 "Slovenia": "SI",
//                 "United States": "US",
//                 // Add more countries as needed
//             };
//             const countryCode = countryCodes[personalInfo.country] || personalInfo.country;

//             const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
//                 payment_method: {
//                     card: cardElement,
//                     billing_details: {
//                         name: `${personalInfo.firstName} ${personalInfo.lastName}`,
//                         email: personalInfo.email,
//                         address: {
//                             city: personalInfo.city || null,
//                             country: countryCode || null,
//                             postal_code: personalInfo.postalCode || null,
//                         },
//                     },
//                 },
//             });

//             if (error) {
//                 console.error('Payment failed:', error.message);
//                 alert(`Payment failed: ${error.message}`);
//             } else if (paymentIntent && paymentIntent.status === 'succeeded') {
//                 alert('Payment successful!');
//             }
//         });
//     } catch (error) {
//         console.error('Error creating payment intent:', error);
//    }
//}


/* ==========================
   MISCELLANEOUS LOGIC
========================== */

// Handle header behavior on scroll
function handleScroll() {
    const header = document.getElementById('top-menu');
    if (!header) return;

    const logoText = document.getElementById('logo-text');
    if (!logoText) return;

    const navLinks = document.getElementById('nav-links')?.getElementsByTagName('a') || [];
    const menuLinks = document.getElementById('menu-links')?.getElementsByTagName('a') || [];


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

// At the end of main.js
window.saveSubscriptionOptions = saveSubscriptionOptions;
