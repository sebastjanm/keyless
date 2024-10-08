// fetchAllCars.js
export async function fetchAllCars(filters = {}) {
    try {
        const queryString = new URLSearchParams(filters).toString();
        const response = await fetch(`/api/cars?${queryString}`);  // Updated to use /api path for Vercel
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const json = await response.json();
        if (json.error) {
            throw new Error(json.details || 'Unexpected error');
        }

        return json;
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
