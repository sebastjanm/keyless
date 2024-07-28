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

// Attach the scroll event listener
window.addEventListener('scroll', handleScroll);

// Initial call to set the correct state when the page loads
document.addEventListener('DOMContentLoaded', handleScroll);

// Fetch and display car data dynamically
async function fetchCars() {
    const carCardsContainer = document.getElementById('car-cards-container');

    try {
        // Make a request to the server to fetch car data
        const response = await fetch('/cars');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse the response as JSON
        const cars = await response.json();
        console.log('Fetched Cars:', cars); // Log fetched cars for debugging

        // Clear any existing car cards
        carCardsContainer.innerHTML = '';

        // Create car cards for each car, limiting to 4
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
            carCardsContainer.appendChild(carCard);
        });
    } catch (error) {
        // Log the error and display an error message to the user
        console.error('Error fetching cars:', error);
        carCardsContainer.innerHTML = '<p class="text-red-500">Failed to load car data. Please try again later.</p>';
    }
}

// Attach the function to run on DOMContentLoaded event
document.addEventListener('DOMContentLoaded', () => {
    fetchCars().then(() => {
        console.log('Cars fetched and displayed successfully');
    }).catch(error => {
        console.error('Error during fetchCars execution:', error);
    });
});
