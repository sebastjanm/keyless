// fetchFilters.js
export async function fetchFilters() {
    try {
        const response = await fetch('/api/filters');  // Updated to use /api path for Vercel
        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const filters = await response.json();
        
        // Ensure the correct mapping between API fields and dropdowns
        populateSelect('brand', filters.brands);
        populateSelect('vehicleType', filters.vehicleTypes);
        populateSelect('fuel', filters.fuelTypes);
        populateSelect('transmission', filters.transmissions);
        populateSelect('drive', filters.driveTrains);
        populateSelect('color', filters.colors);
        populateSelect('availability', filters.availability);
    } catch (error) {
        console.error('Error fetching filters:', error);
        showError('Error fetching filters. Please try again later.');
    }
}

function populateSelect(id, options) {
    const select = document.getElementById(id);
    if (!select) {
        console.error(`Select element with id '${id}' not found.`);
        return;
    }
    select.innerHTML = '<option value="">Select an option</option>';
    options.forEach(option => {
        const opt = document.createElement('option');
        opt.value = option;
        opt.textContent = option;
        select.appendChild(opt);
    });
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
