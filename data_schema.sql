-- Drop existing tables if necessary
DROP TABLE IF EXISTS car_pricing CASCADE;
DROP TABLE IF EXISTS pricing CASCADE;
DROP TABLE IF EXISTS subscription_durations CASCADE;
DROP TABLE IF EXISTS insurance_packages CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS car_model_images CASCADE;
DROP TABLE IF EXISTS car_models CASCADE;
DROP TABLE IF EXISTS car_status_types CASCADE;
DROP TABLE IF EXISTS colors CASCADE;
DROP TABLE IF EXISTS vehicle_types CASCADE;
DROP TABLE IF EXISTS drive_types CASCADE;
DROP TABLE IF EXISTS transmission_types CASCADE;
DROP TABLE IF EXISTS fuel_types CASCADE;
DROP TABLE IF EXISTS electric_specs CASCADE;
DROP TABLE IF EXISTS fuel_specs CASCADE;

-- Car Status Types
CREATE TABLE car_status_types (
    status_id SERIAL PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Fuel Types
CREATE TABLE fuel_types (
    fuel_type_id SERIAL PRIMARY KEY,
    fuel_type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Transmission Types
CREATE TABLE transmission_types (
    transmission_type_id SERIAL PRIMARY KEY,
    transmission_name VARCHAR(50) NOT NULL UNIQUE
);

-- Drive Types
CREATE TABLE drive_types (
    drive_type_id SERIAL PRIMARY KEY,
    drive_type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Vehicle Types
CREATE TABLE vehicle_types (
    vehicle_type_id SERIAL PRIMARY KEY,
    vehicle_type_name VARCHAR(50) NOT NULL UNIQUE
);

-- Colors
CREATE TABLE colors (
    color_id SERIAL PRIMARY KEY,
    color_name VARCHAR(50) NOT NULL UNIQUE
);

-- Car Models Table
CREATE TABLE car_models (
    model_id SERIAL PRIMARY KEY,
    model_name VARCHAR(50) NOT NULL,
    manufacturer VARCHAR(50) NOT NULL,
    description TEXT,
    trailer_hitch BOOLEAN DEFAULT FALSE,
    transmission_type_id INT REFERENCES transmission_types(transmission_type_id),
    drive_type_id INT REFERENCES drive_types(drive_type_id),
    seats INT NOT NULL CHECK (seats > 0),
    doors INT NOT NULL CHECK (doors > 0),
    fuel_type_id INT REFERENCES fuel_types(fuel_type_id),
    vehicle_type_id INT REFERENCES vehicle_types(vehicle_type_id),
    config_basis TEXT[],
    config_safety TEXT[],
    config_entertainment TEXT[],
    config_comfort TEXT[],
    is_electric BOOLEAN NOT NULL DEFAULT FALSE
);

-- Table for Electric Vehicle Specifications
CREATE TABLE electric_specs (
    spec_id SERIAL PRIMARY KEY,
    model_id INT REFERENCES car_models(model_id) ON DELETE CASCADE,
    battery_capacity DECIMAL(5,2) CHECK (battery_capacity > 0),
    max_charging DECIMAL(4,1) CHECK (max_charging > 0)
);

-- Table for Fuel-Based Vehicle Specifications
CREATE TABLE fuel_specs (
    spec_id SERIAL PRIMARY KEY,
    model_id INT REFERENCES car_models(model_id) ON DELETE CASCADE,
    fuel_tank_capacity DECIMAL(5,2) CHECK (fuel_tank_capacity > 0),
    fuel_consumption DECIMAL(3,1) CHECK (fuel_consumption > 0),
    horse_power INT CHECK (horse_power > 0),
    engine_size DECIMAL(3,1) CHECK (engine_size > 0),
    co2_emissions INT CHECK (co2_emissions >= 0)
);

-- Table to store multiple images per car model
CREATE TABLE car_model_images (
    image_id SERIAL PRIMARY KEY,
    model_id INT REFERENCES car_models(model_id) ON DELETE CASCADE,
    image_url VARCHAR(255) NOT NULL
);

-- Individual Vehicles Table
CREATE TABLE cars (
    car_id SERIAL PRIMARY KEY,
    model_id INT REFERENCES car_models(model_id) ON DELETE CASCADE,
    vin VARCHAR(50) UNIQUE NOT NULL,
    registration VARCHAR(20) UNIQUE NOT NULL,
    mileage INT CHECK (mileage >= 0) NOT NULL,
    battery_level DECIMAL(5,2) CHECK (battery_level BETWEEN 0 AND 100) DEFAULT 100, -- Only for electric vehicles
    color_id INT REFERENCES colors(color_id),
    status_id INT REFERENCES car_status_types(status_id)
);

-- Subscription Durations
CREATE TABLE subscription_durations (
    duration_id SERIAL PRIMARY KEY,
    months INT NOT NULL CHECK (months > 0)
);

-- Insurance Packages
CREATE TABLE insurance_packages (
    insurance_package_id SERIAL PRIMARY KEY,
    package_name VARCHAR(50) NOT NULL UNIQUE
);

-- Pricing Table
CREATE TABLE pricing (
    pricing_id SERIAL PRIMARY KEY,
    duration_id INT REFERENCES subscription_durations(duration_id),
    monthly_payment NUMERIC(10,2) NOT NULL CHECK (monthly_payment > 0),
    deposit NUMERIC(10,2) NOT NULL CHECK (deposit >= 0),
    included_mileage INT NOT NULL CHECK (included_mileage > 0),
    excess_mileage_fee NUMERIC(5,2) NOT NULL CHECK (excess_mileage_fee >= 0),
    insurance_package_id INT REFERENCES insurance_packages(insurance_package_id),
    administration_fee NUMERIC(10,2) NOT NULL CHECK (administration_fee > 0)
);

-- Car Pricing Table
CREATE TABLE car_pricing (
    car_pricing_id SERIAL PRIMARY KEY,
    car_id INT REFERENCES cars(car_id) ON DELETE CASCADE,
    pricing_id INT REFERENCES pricing(pricing_id) ON DELETE CASCADE
);
