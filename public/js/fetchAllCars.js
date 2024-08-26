// fetchAllCars.js
export async function fetchAllCars(filters = {}) {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`/cars?${queryString}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cars = await response.json();
        return cars;
    } catch (error) {
        console.error('Error fetching all cars:', error);
        throw error;
    }
}


function getFilterValues() {
    const filterForm = document.getElementById('filterForm');
    const filterValues = {};

    if (filterForm) {
        filterForm.querySelectorAll('select').forEach(element => {
            const name = element.name.trim();
            const value = element.value.trim();

            if (name && value) {
                filterValues[name] = value;
            }
        });
    }

    return filterValues;
}


