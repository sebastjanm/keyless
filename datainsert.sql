-- Insert Car Models and Specifications

-- BMW X5 (Diesel)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'X5', 'BMW', 'Luxury diesel SUV', TRUE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'All-Wheel Drive' LIMIT 1), 
    5, 5, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Diesel' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'SUV' LIMIT 1),
    ARRAY['Leather seats'], ARRAY['Airbags'], ARRAY['Premium Audio'], ARRAY['Heated Seats'], FALSE
);

-- Insert fuel specs for BMW X5
INSERT INTO fuel_specs (model_id, fuel_tank_capacity, fuel_consumption, horse_power, engine_size, co2_emissions) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'X5' AND manufacturer = 'BMW' LIMIT 1), 
    80.0, 6.5, 300, 3.0, 180
);

-- Audi Q7 (Diesel)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Q7', 'Audi', 'Spacious diesel SUV', TRUE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'All-Wheel Drive' LIMIT 1), 
    7, 5, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Diesel' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'SUV' LIMIT 1),
    ARRAY['Panoramic roof'], ARRAY['Lane Assist'], ARRAY['Touchscreen'], ARRAY['Climate Control'], FALSE
);

-- Insert fuel specs for Audi Q7
INSERT INTO fuel_specs (model_id, fuel_tank_capacity, fuel_consumption, horse_power, engine_size, co2_emissions) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Q7' AND manufacturer = 'Audi' LIMIT 1), 
    85.0, 7.2, 320, 3.0, 200
);

-- Nissan Leaf (Electric)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Leaf', 'Nissan', 'Affordable electric hatchback', FALSE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'Front-Wheel Drive' LIMIT 1), 
    5, 4, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Electric' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'Hatchback' LIMIT 1),
    ARRAY['Basic seats'], ARRAY['Airbags'], ARRAY['Touchscreen'], ARRAY['Climate Control'], TRUE
);

-- Insert electric specs for Nissan Leaf
INSERT INTO electric_specs (model_id, battery_capacity, max_charging) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Leaf' AND manufacturer = 'Nissan' LIMIT 1), 
    62.0, 150.0
);

-- Mercedes-Benz E-Class (Bencine)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'E-Class', 'Mercedes-Benz', 'Executive petrol sedan', FALSE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'Rear-Wheel Drive' LIMIT 1), 
    5, 4, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Bencine' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'Sedan' LIMIT 1),
    ARRAY['Leather seats'], ARRAY['Lane Assist'], ARRAY['Premium Audio'], ARRAY['Dual-Zone AC'], FALSE
);

-- Insert fuel specs for Mercedes-Benz E-Class
INSERT INTO fuel_specs (model_id, fuel_tank_capacity, fuel_consumption, horse_power, engine_size, co2_emissions) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'E-Class' AND manufacturer = 'Mercedes-Benz' LIMIT 1), 
    70.0, 8.0, 350, 3.5, 220
);

-- Hyundai Kona (Hybrid)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Kona', 'Hyundai', 'Compact hybrid SUV', FALSE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'Front-Wheel Drive' LIMIT 1), 
    5, 5, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Hybrid' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'SUV' LIMIT 1),
    ARRAY['Cloth seats'], ARRAY['Lane Keep Assist'], ARRAY['Basic Audio'], ARRAY['Manual AC'], FALSE
);

-- Insert fuel specs for Hyundai Kona
INSERT INTO fuel_specs (model_id, fuel_tank_capacity, fuel_consumption, horse_power, engine_size, co2_emissions) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Kona' AND manufacturer = 'Hyundai' LIMIT 1), 
    45.0, 4.5, 180, 1.6, 100
);

-- Tesla Model 3 (Electric)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Model 3', 'Tesla', 'Affordable electric sedan', FALSE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'Rear-Wheel Drive' LIMIT 1), 
    5, 4, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Electric' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'Sedan' LIMIT 1),
    ARRAY['Basic seats'], ARRAY['Airbags'], ARRAY['Touchscreen'], ARRAY['Climate Control'], TRUE
);

-- Insert electric specs for Tesla Model 3
INSERT INTO electric_specs (model_id, battery_capacity, max_charging) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Model 3' AND manufacturer = 'Tesla' LIMIT 1), 
    75.0, 200.0
);

-- VW Golf Variant (Diesel)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Golf Variant', 'Volkswagen', 'Compact diesel estate', TRUE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Manual' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'Front-Wheel Drive' LIMIT 1), 
    5, 5, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Diesel' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'Hatchback' LIMIT 1),
    ARRAY['Cloth seats'], ARRAY['ABS'], ARRAY['Basic Audio'], ARRAY['Manual AC'], FALSE
);

-- Insert fuel specs for VW Golf Variant
INSERT INTO fuel_specs (model_id, fuel_tank_capacity, fuel_consumption, horse_power, engine_size, co2_emissions) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Golf Variant' AND manufacturer = 'Volkswagen' LIMIT 1), 
    55.0, 5.8, 170, 2.2, 130
);

-- Peugeot e-2008 (Electric)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'e-2008', 'Peugeot', 'Compact electric SUV', TRUE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'Front-Wheel Drive' LIMIT 1), 
    5, 4, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Electric' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'SUV' LIMIT 1),
    ARRAY['Panoramic roof'], ARRAY['Lane Assist'], ARRAY['Touchscreen'], ARRAY['Heated Seats'], TRUE
);

-- Insert electric specs for Peugeot e-2008
INSERT INTO electric_specs (model_id, battery_capacity, max_charging) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'e-2008' AND manufacturer = 'Peugeot' LIMIT 1), 
    50.0, 100.0
);

-- Toyota RAV4 Hybrid Advanced (Hybrid)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'RAV4 Hybrid Advanced', 'Toyota', 'Advanced hybrid SUV', TRUE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'All-Wheel Drive' LIMIT 1), 
    5, 5, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Hybrid' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'SUV' LIMIT 1),
    ARRAY['Adaptive Cruise Control'], ARRAY['Lane Keep Assist'], ARRAY['Premium Audio'], ARRAY['Dual-Zone AC'], FALSE
);

-- Insert fuel specs for Toyota RAV4 Hybrid Advanced
INSERT INTO fuel_specs (model_id, fuel_tank_capacity, fuel_consumption, horse_power, engine_size, co2_emissions) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'RAV4 Hybrid Advanced' AND manufacturer = 'Toyota' LIMIT 1), 
    55.0, 4.8, 240, 2.5, 90
);

-- Tesla Model S Plaid (Electric)
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Model S Plaid', 'Tesla', 'High-performance electric sedan', FALSE, 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic' LIMIT 1), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'All-Wheel Drive' LIMIT 1), 
    5, 4, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Electric' LIMIT 1), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'Sedan' LIMIT 1),
    ARRAY['Performance seats'], ARRAY['Airbags'], ARRAY['Touchscreen'], ARRAY['Climate Control'], TRUE
);

-- Insert electric specs for Tesla Model S Plaid
INSERT INTO electric_specs (model_id, battery_capacity, max_charging) VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Model S Plaid' AND manufacturer = 'Tesla' LIMIT 1), 
    100.0, 250.0
);


-- Insert Cars

-- BMW X5
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'X5' AND manufacturer = 'BMW' LIMIT 1), 
    'WBASN4C51CC000001', 'BMWX5001', 15000, 
    (SELECT color_id FROM colors WHERE color_name = 'Black' LIMIT 1), 
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- Audi Q7
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Q7' AND manufacturer = 'Audi' LIMIT 1), 
    'WA1LAAF75MD000001', 'AUDIQ7001', 10000, 
    (SELECT color_id FROM colors WHERE color_name = 'White' LIMIT 1), 
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- Nissan Leaf
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Leaf' AND manufacturer = 'Nissan' LIMIT 1), 
    '1N4AZ1CP1KC000001', 'NISSANL01', 5000, 
    (SELECT color_id FROM colors WHERE color_name = 'Blue' LIMIT 1), 
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- Mercedes-Benz E-Class
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'E-Class' AND manufacturer = 'Mercedes-Benz' LIMIT 1), 
    'WDD2130481A000001', 'MBECLAS01', 8000, 
    (SELECT color_id FROM colors WHERE color_name = 'Silver' LIMIT 1), 
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- Hyundai Kona
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Kona' AND manufacturer = 'Hyundai' LIMIT 1), 
    'KM8K22AA8LU000001', 'HYUKONA01', 7000, 
    (SELECT color_id FROM colors WHERE color_name = 'Red' LIMIT 1), 
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- Tesla Model 3
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Model 3' AND manufacturer = 'Tesla' LIMIT 1),
    '5YJ3E1EA8JF000002', 'TESLA3002', 6000, 
    (SELECT color_id FROM colors WHERE color_name = 'Black' LIMIT 1),
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- VW Golf Variant
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Golf Variant' AND manufacturer = 'Volkswagen' LIMIT 1), 
    'WVWZZZ1JZXW000002', 'GOLFV123', 15000, 
    (SELECT color_id FROM colors WHERE color_name = 'White' LIMIT 1), 
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- Peugeot e-2008
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'e-2008' AND manufacturer = 'Peugeot' LIMIT 1),
    'VR3LBHNYN87600002', 'PEUGEOT2008', 8000, 
    (SELECT color_id FROM colors WHERE color_name = 'Red' LIMIT 1),
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- Toyota RAV4 Hybrid Advanced
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'RAV4 Hybrid Advanced' AND manufacturer = 'Toyota' LIMIT 1),
    'JTMBFREV2JJ000002', 'TOYORAV4ADV', 12000, 
    (SELECT color_id FROM colors WHERE color_name = 'Silver' LIMIT 1), 
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- Tesla Model S Plaid
INSERT INTO cars (model_id, vin, registration, mileage, color_id, status_id)
VALUES (
    (SELECT model_id FROM car_models WHERE model_name = 'Model S Plaid' AND manufacturer = 'Tesla' LIMIT 1),
    '5YJSA1E26JF000002', 'TESLASPLAID', 7000, 
    (SELECT color_id FROM colors WHERE color_name = 'Blue' LIMIT 1), 
    (SELECT status_id FROM car_status_types WHERE status_name = 'available' LIMIT 1)
);

-- Insert Car Model Images

-- BMW X5 Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'X5' AND manufacturer = 'BMW' LIMIT 1), 'https://picsum.photos/600/360?random=11'),
((SELECT model_id FROM car_models WHERE model_name = 'X5' AND manufacturer = 'BMW' LIMIT 1), 'https://picsum.photos/600/360?random=12');

-- Audi Q7 Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Q7' AND manufacturer = 'Audi' LIMIT 1), 'https://picsum.photos/600/360?random=13'),
((SELECT model_id FROM car_models WHERE model_name = 'Q7' AND manufacturer = 'Audi' LIMIT 1), 'https://picsum.photos/600/360?random=14');

-- Nissan Leaf Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Leaf' AND manufacturer = 'Nissan' LIMIT 1), 'https://picsum.photos/600/360?random=15'),
((SELECT model_id FROM car_models WHERE model_name = 'Leaf' AND manufacturer = 'Nissan' LIMIT 1), 'https://picsum.photos/600/360?random=16');

-- Mercedes-Benz E-Class Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'E-Class' AND manufacturer = 'Mercedes-Benz' LIMIT 1), 'https://picsum.photos/600/360?random=17'),
((SELECT model_id FROM car_models WHERE model_name = 'E-Class' AND manufacturer = 'Mercedes-Benz' LIMIT 1), 'https://picsum.photos/600/360?random=18');

-- Hyundai Kona Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Kona' AND manufacturer = 'Hyundai' LIMIT 1), 'https://picsum.photos/600/360?random=19'),
((SELECT model_id FROM car_models WHERE model_name = 'Kona' AND manufacturer = 'Hyundai' LIMIT 1), 'https://picsum.photos/600/360?random=20');

-- Tesla Model 3 Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Model 3' AND manufacturer = 'Tesla' LIMIT 1), 'https://picsum.photos/600/360?random=21'),
((SELECT model_id FROM car_models WHERE model_name = 'Model 3' AND manufacturer = 'Tesla' LIMIT 1), 'https://picsum.photos/600/360?random=22');

-- VW Golf Variant Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Golf Variant' AND manufacturer = 'Volkswagen' LIMIT 1), 'https://picsum.photos/600/360?random=23'),
((SELECT model_id FROM car_models WHERE model_name = 'Golf Variant' AND manufacturer = 'Volkswagen' LIMIT 1), 'https://picsum.photos/600/360?random=24');

-- Peugeot e-2008 Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'e-2008' AND manufacturer = 'Peugeot' LIMIT 1), 'https://picsum.photos/600/360?random=25'),
((SELECT model_id FROM car_models WHERE model_name = 'e-2008' AND manufacturer = 'Peugeot' LIMIT 1), 'https://picsum.photos/600/360?random=26');

-- Toyota RAV4 Hybrid Advanced Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'RAV4 Hybrid Advanced' AND manufacturer = 'Toyota' LIMIT 1), 'https://picsum.photos/600/360?random=27'),
((SELECT model_id FROM car_models WHERE model_name = 'RAV4 Hybrid Advanced' AND manufacturer = 'Toyota' LIMIT 1), 'https://picsum.photos/600/360?random=28');

-- Tesla Model S Plaid Images
INSERT INTO car_model_images (model_id, image_url)
VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Model S Plaid' AND manufacturer = 'Tesla' LIMIT 1), 'https://picsum.photos/600/360?random=29'),
((SELECT model_id FROM car_models WHERE model_name = 'Model S Plaid' AND manufacturer = 'Tesla' LIMIT 1), 'https://picsum.photos/600/360?random=30');

-- Insert Pricing for Cars

-- Pricing for BMW X5 (12-Month Subscription with Premium Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 12 LIMIT 1), 
    900.00, 1800.00, 1500, 0.30, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'CareFree' LIMIT 1), 
    100.00
);

-- Pricing for Audi Q7 (12-Month Subscription with Premium Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 12 LIMIT 1), 
    850.00, 1700.00, 1500, 0.28, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'CareFree' LIMIT 1), 
    90.00
);

-- Pricing for Nissan Leaf (6-Month Subscription with Small Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 6 LIMIT 1), 
    400.00, 800.00, 1000, 0.12, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'Small' LIMIT 1), 
    50.00
);

-- Pricing for Mercedes-Benz E-Class (9-Month Subscription with Basic Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 9 LIMIT 1), 
    750.00, 1500.00, 1200, 0.25, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'Small' LIMIT 1), 
    80.00
);

-- Pricing for Hyundai Kona (9-Month Subscription with Small Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 9 LIMIT 1), 
    550.00, 1100.00, 1200, 0.20, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'Small' LIMIT 1), 
    60.00
);

-- Pricing for Tesla Model 3 (6-Month Subscription with Small Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 6), 
    550.00, 1200.00, 1000, 0.18, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'Small'), 
    60.00
);

-- Pricing for VW Golf Variant (6-Month Subscription with Small Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 6), 
    400.00, 900.00, 800, 0.16, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'Small'), 
    40.00
);

-- Pricing for Peugeot e-2008 (9-Month Subscription with Basic Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 9), 
    650.00, 1300.00, 1200, 0.20, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'Small'), 
    70.00
);

-- Pricing for Toyota RAV4 Hybrid Advanced (12-Month Subscription with Premium Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 12), 
    750.00, 1500.00, 1500, 0.24, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'CareFree'), 
    80.00
);

-- Pricing for Tesla Model S Plaid (12-Month Subscription with Premium Insurance)
INSERT INTO pricing (duration_id, monthly_payment, deposit, included_mileage, excess_mileage_fee, insurance_package_id, administration_fee)
VALUES (
    (SELECT duration_id FROM subscription_durations WHERE months = 12), 
    1100.00, 2000.00, 1500, 0.30, 
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'CareFree'), 
    100.00
);

-- Associate Pricing with Cars

-- Link BMW X5 to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = 'WBASN4C51CC000001' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 900.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 12 LIMIT 1) LIMIT 1)
);

-- Link Audi Q7 to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = 'WA1LAAF75MD000001' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 850.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 12 LIMIT 1) LIMIT 1)
);

-- Link Nissan Leaf to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = '1N4AZ1CP1KC000001' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 400.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 6 LIMIT 1) LIMIT 1)
);

-- Link Mercedes-Benz E-Class to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = 'WDD2130481A000001' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 750.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 9 LIMIT 1) LIMIT 1)
);

-- Link Hyundai Kona to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = 'KM8K22AA8LU000001' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 550.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 9 LIMIT 1) LIMIT 1)
);

-- Link Tesla Model 3 to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = '5YJ3E1EA8JF000002' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 550.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 6 LIMIT 1) LIMIT 1)
);

-- Link VW Golf Variant to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = 'WVWZZZ1JZXW000002' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 400.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 6 LIMIT 1) LIMIT 1)
);

-- Link Peugeot e-2008 to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = 'VR3LBHNYN87600002' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 650.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 9 LIMIT 1) LIMIT 1)
);

-- Link Toyota RAV4 Hybrid Advanced to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = 'JTMBFREV2JJ000002' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 750.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 12 LIMIT 1) LIMIT 1)
);

-- Link Tesla Model S Plaid to its pricing
INSERT INTO car_pricing (car_id, pricing_id)
VALUES (
    (SELECT car_id FROM cars WHERE vin = '5YJSA1E26JF000002' LIMIT 1), 
    (SELECT pricing_id FROM pricing WHERE monthly_payment = 1100.00 AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 12 LIMIT 1) LIMIT 1)
);

