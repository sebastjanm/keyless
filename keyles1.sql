-- Data Types
CREATE TYPE fuel_type AS ENUM ('Petrol', 'Diesel', 'Electric', 'Hybrid');
CREATE TYPE transmission_type AS ENUM ('Manual', 'Automatic');
CREATE TYPE drive_type AS ENUM ('Front-Wheel Drive', 'Rear-Wheel Drive', 'All-Wheel Drive');
CREATE TYPE insurance_package_type AS ENUM ('None', 'Small', 'CareFree');
CREATE TYPE delivery_status_type AS ENUM ('Pending', 'In Transit', 'Delivered', 'Cancelled');
CREATE TYPE rental_phase_type AS ENUM ('Reserved', 'Delivery', 'Rental', 'Returned');
CREATE TYPE car_status_type AS ENUM ('Available', 'Reserved', 'Rented', 'Maintenance', 'Decommissioned');
CREATE TYPE car_condition_type AS ENUM ('New', 'Good', 'Fair', 'Poor');

-- Tables

CREATE TABLE car_categories (
    category_id SERIAL PRIMARY KEY,
    category_type VARCHAR(50) NOT NULL 
);

CREATE TABLE colors (
    color_id SERIAL PRIMARY KEY,
    color_name VARCHAR(50) NOT NULL 
);

CREATE TABLE energy_efficiency_ratings (
    efficiency_id SERIAL PRIMARY KEY,
    efficiency_rating VARCHAR(10) NOT NULL 
);

CREATE TABLE locations (
    location_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(200) NOT NULL,
    postcode VARCHAR(10) NOT NULL,
    latitude NUMERIC(10,6) NOT NULL CHECK (latitude >= 0),
    longitude NUMERIC(10,6) NOT NULL CHECK (longitude >= 0)
);

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    mobile_phone VARCHAR(20),
    country VARCHAR(50),
    home_address VARCHAR(255),
    driving_license VARCHAR(50)
);

CREATE TABLE car_models (
    model_id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    model VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    description TEXT,
    acriss_code VARCHAR(4),
    trailer_hitch BOOLEAN DEFAULT FALSE,
    additional_cost_per_km NUMERIC(5,2),
    efficiency_id INT REFERENCES energy_efficiency_ratings(efficiency_id),
    transmission transmission_type,
    seats INT,
    doors INT,
    shopping_bags INT,
    fuel_type fuel_type,
    fuel_consumption DECIMAL(3,1),
    horse_power INT,
    engine_size DECIMAL(3,1),
    co2_emissions INT,
    battery_capacity DECIMAL(5,2),
    max_charging DECIMAL(4,1),
    drive drive_type,
    category_id INT REFERENCES car_categories(category_id),
    displacement DECIMAL(3,1),
    -- Configuration data
    config_basis TEXT[],
    config_safety TEXT[],
    config_entertainment TEXT[],
    config_comfort TEXT[]
);

CREATE TABLE cars (
    car_id SERIAL PRIMARY KEY,
    model_id INT REFERENCES car_models(model_id),
    vin VARCHAR(50) UNIQUE NOT NULL,
    registration VARCHAR(20) UNIQUE,
    mileage INT,
    battery_charge_level DECIMAL(5,2) CHECK (battery_charge_level >= 0 AND battery_charge_level <= 100),
    status car_status_type,
    condition car_condition_type
);

CREATE TABLE car_colors (
    car_color_id SERIAL PRIMARY KEY,
    car_id INT REFERENCES cars(car_id) ON DELETE CASCADE,
    color_id INT REFERENCES colors(color_id) ON DELETE CASCADE
);

CREATE TABLE pricing (
    pricing_id SERIAL PRIMARY KEY,
    monthly_payment INT NOT NULL CHECK (monthly_payment IN (3, 6, 9, 12)),
    deposit NUMERIC(10,2),
    excess_mileage_fee NUMERIC(5,2),
    insurance_package insurance_package_type,
    extras TEXT,
    administration_fee NUMERIC(10,2) NOT NULL
);

CREATE TABLE car_pricing (
    car_pricing_id SERIAL PRIMARY KEY,
    car_id INT REFERENCES cars(car_id) ON DELETE CASCADE,
    pricing_id INT REFERENCES pricing(pricing_id) ON DELETE CASCADE
);

CREATE TABLE subscription_configurations (
    config_id SERIAL PRIMARY KEY,
    contract_length INT CHECK (contract_length IN (3, 6, 12, 24)),
    km_per_month INT CHECK (km_per_month IN (1000, 1500, 2000, 2500, 3000, 3500, 4000))
);

CREATE TABLE subscriptions (
    subscription_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    car_id INT REFERENCES cars(car_id) ON DELETE CASCADE,
    pricing_id INT REFERENCES pricing(pricing_id),
    config_id INT REFERENCES subscription_configurations(config_id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    monthly_mileage INT,
    additional_mileage_cost NUMERIC(5,2),
    total_mileage INT,
    total_cost NUMERIC(10,2),
    additional_cost_per_km NUMERIC(5,2),
    insurance_package insurance_package_type NOT NULL DEFAULT 'None',
    pickup_location_id INT REFERENCES locations(location_id),
    dropoff_location_id INT REFERENCES locations(location_id),
    rental_phase rental_phase_type NOT NULL DEFAULT 'Reserved'
);

