import { fetchPopularCars } from './fetchPopularCars.js'; // New function for index.html
import { fetchAllCars } from './fetchAllCars.js';         // New function for cars.html
import { fetchFilters } from './fetchFilters.js';

document.addEventListener('DOMContentLoaded', function () {
    console.log("DOM fully loaded and parsed");

    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Detect the page context and call the correct function
    if (document.getElementById('popular-cars')) {
        // This is index.html
        fetchPopularCars().then(() => {
            console.log("Popular cars fetched and populated successfully");
        }).catch(error => {
            console.error("Error fetching popular cars:", error);
        });
    } else if (document.getElementById('vehicleList')) {
        // This is cars.html
        fetchFilters().then(() => {
            console.log("Filters fetched successfully");
            return fetchAllCars();  // Fetch cars after filters load
        }).then(() => {
            console.log("All cars fetched and populated successfully");
        }).catch(error => {
            console.error("Error fetching filters or all cars:", error);
        });
    }

    const resetFiltersButton = document.getElementById('resetFilters');
    if (resetFiltersButton) {
        resetFiltersButton.addEventListener('click', resetFilters);
    }

    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.querySelectorAll('select').forEach(element => {
            element.addEventListener('change', () => fetchAllCars());
        });
    }

    handleScroll();
    window.addEventListener('scroll', handleScroll);
});

function handleScroll() {
    const header = document.getElementById('top-menu');
    const logoText = document.getElementById('logo-text');
    const navLinks = document.getElementById('nav-links').getElementsByTagName('a');
    const menuLinks = document.getElementById('menu-links').getElementsByTagName('a');

    if (header && logoText && navLinks.length > 0 && menuLinks.length > 0) {
        if (window.scrollY > 50) {
            header.classList.add('bg-white');
            header.classList.remove('bg-orange', 'bg-opacity-80');
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

function resetFilters() {
    const filterForm = document.getElementById('filterForm');
    if (filterForm) {
        filterForm.reset();
        fetchAllCars();  // Refresh car list with cleared filters
    }
}


