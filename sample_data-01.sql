-- Insert Predefined Mileage Plans
INSERT INTO mileage_plans (kilometers, price_modifier, description) VALUES
(500, 0.00, '500 KM'),                         
(750, 30.00, '750 KM (+30 €)'),              
(1000, 80.00, '1000 KM (+80 €)'),            
(1750, 190.00, '1750 KM (+190 €)'),          
(2500, 440.00, '2500 KM (+440 €)'),          
(3000, 690.00, '3000 KM (+690 €)');

-- Insert Predefined Subscription Durations
INSERT INTO subscription_durations (months, price_modifier, description) VALUES
(48, 0.00, 'Min. 48 Months'),                   
(36, 0.00, 'Min. 36 Months'),                   
(24, 30.00, 'Min. 24 Months (+30 €)'),          
(18, 80.00, 'Min. 18 Months (+80 €)'),          
(12, 140.00, 'Min. 12 Months (+140 €)'),        
(6, 200.00, 'Min. 6 Months (+200 €)');          

-- Insert Predefined Insurance Packages
INSERT INTO insurance_packages (package_name, price_modifier, description) VALUES
('MINIMUM', 0.00, 'Minimum coverage, no additional cost'),
('BASIC', 70.00, 'Basic coverage (+70 €)'),
('PREMIUM', 126.00, 'Premium coverage (+126 €)');

-- Insert Sample Package Types
INSERT INTO package_types (package_name, price_modifier, description) 
VALUES 
('fixed', 0.00, 'Fixed package with no additional cost'),
('flexible', 50.00, 'Flexible package with a small additional cost');

-- Insert Sample Car Status Types
INSERT INTO car_status_types (status_name) VALUES
('Available'),
('In Maintenance'),
('Reserved');

-- Insert Sample Transmission Types
INSERT INTO transmission_types (transmission_name) VALUES
('Manual'),
('Automatic');

-- Insert Sample Drive Types
INSERT INTO drive_types (drive_type_name) VALUES
('FWD'),  -- Front-Wheel Drive
('RWD'),  -- Rear-Wheel Drive
('AWD');  -- All-Wheel Drive

-- Insert Sample Vehicle Types
INSERT INTO vehicle_types (vehicle_type_name) VALUES
('Sedan'),
('SUV'),
('Truck'),
('Coupe'),
('Hatchback');

-- Insert Sample Colors
INSERT INTO colors (color_name) VALUES
('Red'),
('Blue'),
('Black'),
('White'),
('Silver');

INSERT INTO delivery_options (option_name, price_modifier) VALUES
('Home Delivery', 50.00),
('Pickup from Store', 0.00);


-- Insert Users
INSERT INTO users (name, surname, email, mobile_phone, address, citizenship, status, password_hash) VALUES
('John', 'Doe', 'john.doe@example.com', '+1234567890', '123 Main St, Springfield', 'USA', 'Verified', 'hashed_password_value1'),
('Jane', 'Smith', 'jane.smith@example.com', '+9876543210', '456 Elm St, Springfield', 'USA', 'Verified', 'hashed_password_value2'),
('Alice', 'Johnson', 'alice.johnson@example.com', '+1122334455', '789 Oak St, Springfield', 'Canada', 'Verified', 'hashed_password_value3'),
('Robert', 'Taylor', 'robert.taylor@example.com', '+1230987654', '12 Lakeview Rd, Springfield', 'UK', 'Verified', 'hashed_password_value4'),
('Emily', 'Davis', 'emily.davis@example.com', '+5671234567', '34 Pine St, Springfield', 'Australia', 'Verified', 'hashed_password_value5'),
('Michael', 'Brown', 'michael.brown@example.com', '+9823456789', '78 Maple St, Springfield', 'Germany', 'Verified', 'hashed_password_value6'),
('Sarah', 'Miller', 'sarah.miller@example.com', '+8765432109', '90 Birch St, Springfield', 'USA', 'Verified', 'hashed_password_value7'),
('Charlie', 'Wilson', 'charlie.wilson@example.com', '+1234560987', '15 Spruce St, Springfield', 'USA', 'Banned', 'hashed_password_value8'),
('Olivia', 'Moore', 'olivia.moore@example.com', '+9988776655', '456 Cedar St, Springfield', 'Canada', 'Banned', 'hashed_password_value9'),
('James', 'White', 'james.white@example.com', '+6655443322', '789 Redwood St, Springfield', 'Australia', 'Banned', 'hashed_password_value10'),
('Grace', 'Hall', 'grace.hall@example.com', '+1234432110', '123 Aspen St, Springfield', 'UK', 'Waiting', 'hashed_password_value11'),
('Noah', 'King', 'noah.king@example.com', '+2345678901', '678 Willow St, Springfield', 'New Zealand', 'Waiting', 'hashed_password_value12'),
('Chloe', 'Young', 'chloe.young@example.com', '+8765543210', '234 Elm St, Springfield', 'Ireland', 'Waiting', 'hashed_password_value13'),
('Liam', 'Harris', 'liam.harris@example.com', '+9988112233', '345 Oak St, Springfield', 'India', 'Waiting', 'hashed_password_value14'),
('Zoe', 'Wright', 'zoe.wright@example.com', '+6677889900', '456 Poplar St, Springfield', 'USA', 'Waiting', 'hashed_password_value15');

-- Insert Vehicles and Specifications

-- 1st Electric Vehicle: Tesla Model S
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Model S', 'Tesla', 'Electric luxury sedan', 'NO', 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic'), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'AWD'), 
    5, 4, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Electric'), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'Sedan'),
    ARRAY['Premium Sound'], ARRAY['Autopilot'], ARRAY['Bluetooth'], ARRAY['Heated Seats'], TRUE
);

INSERT INTO electric_specs (model_id, battery_capacity, max_charging) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'Model S'), 100.0, 250.0);

INSERT INTO cars (model_id, vin, registration, mileage, battery_level, color_id, status_id) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'Model S'), '5YJSA1E26MF1S001', 'TESLA001', 5000, 95.00, 
(SELECT color_id FROM colors WHERE color_name = 'Red'), (SELECT status_id FROM car_status_types WHERE status_name = 'Available'));

-- 2nd Electric Vehicle: Nissan Leaf
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Leaf', 'Nissan', 'Electric compact hatchback', 'NO', 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic'), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'FWD'), 
    5, 4, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Electric'), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'Hatchback'),
    ARRAY['Navigation'], ARRAY['Collision Avoidance'], ARRAY['Bluetooth'], ARRAY['Cloth Seats'], TRUE
);

INSERT INTO electric_specs (model_id, battery_capacity, max_charging) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'Leaf'), 40.0, 100.0);

INSERT INTO cars (model_id, vin, registration, mileage, battery_level, color_id, status_id) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'Leaf'), '1N4BZ1E26MC1002', 'NISSAN001', 8000, 80.00, 
(SELECT color_id FROM colors WHERE color_name = 'Blue'), (SELECT status_id FROM car_status_types WHERE status_name = 'Available'));

-- 3rd Gasoline Vehicle: Ford Mustang
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Mustang', 'Ford', 'Iconic gasoline-powered muscle car', 'YES', 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Manual'), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'RWD'), 
    4, 2, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Gasoline'), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'Coupe'),
    ARRAY['Sports Package'], ARRAY['Airbags'], ARRAY['Premium Sound'], ARRAY['Leather Seats'], FALSE
);

INSERT INTO fuel_specs (model_id, fuel_tank_capacity, fuel_consumption, horse_power, engine_size, co2_emissions) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'Mustang'), 60.0, 12.0, 450, 5.0, 300);

INSERT INTO cars (model_id, vin, registration, mileage, battery_level, color_id, status_id) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'Mustang'), '1FA6P8JZ0K555003', 'FORD001', 12000, NULL, 
(SELECT color_id FROM colors WHERE color_name = 'Black'), (SELECT status_id FROM car_status_types WHERE status_name = 'Available'));

-- 4th Diesel Vehicle: BMW X5
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'X5', 'BMW', 'Luxury diesel SUV', 'YES', 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic'), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'AWD'), 
    5, 5, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Diesel'), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'SUV'),
    ARRAY['Leather seats'], ARRAY['Airbags'], ARRAY['Premium Audio'], ARRAY['Heated Seats'], FALSE
);

INSERT INTO fuel_specs (model_id, fuel_tank_capacity, fuel_consumption, horse_power, engine_size, co2_emissions) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'X5'), 85.0, 7.5, 300, 3.0, 190);

INSERT INTO cars (model_id, vin, registration, mileage, battery_level, color_id, status_id) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'X5'), '5UXKR0C55KLE9004', 'BMW001', 25000, NULL, 
(SELECT color_id FROM colors WHERE color_name = 'White'), (SELECT status_id FROM car_status_types WHERE status_name = 'Available'));

-- 5th Hybrid Vehicle: Toyota Prius
INSERT INTO car_models (
    model_name, manufacturer, description, trailer_hitch, transmission_type_id, drive_type_id, seats, doors, 
    fuel_type_id, vehicle_type_id, config_basis, config_safety, config_entertainment, config_comfort, is_electric
) VALUES (
    'Prius', 'Toyota', 'Hybrid with excellent fuel efficiency', 'NO', 
    (SELECT transmission_type_id FROM transmission_types WHERE transmission_name = 'Automatic'), 
    (SELECT drive_type_id FROM drive_types WHERE drive_type_name = 'FWD'), 
    5, 4, 
    (SELECT fuel_type_id FROM fuel_types WHERE fuel_type_name = 'Hybrid'), 
    (SELECT vehicle_type_id FROM vehicle_types WHERE vehicle_type_name = 'Hatchback'),
    ARRAY['Eco Mode'], ARRAY['Lane Assist'], ARRAY['Bluetooth'], ARRAY['Climate Control'], FALSE
);

INSERT INTO fuel_specs (model_id, fuel_tank_capacity, fuel_consumption, horse_power, engine_size, co2_emissions) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'Prius'), 45.0, 4.5, 120, 1.8, 90);

INSERT INTO cars (model_id, vin, registration, mileage, battery_level, color_id, status_id) 
VALUES ((SELECT model_id FROM car_models WHERE model_name = 'Prius'), 'JTDKB20U973502034', 'TOYOTA001', 3000, NULL, 
(SELECT color_id FROM colors WHERE color_name = 'Silver'), (SELECT status_id FROM car_status_types WHERE status_name = 'Available'));

-- Insert Images for Tesla Model S
INSERT INTO car_model_images (model_id, image_url) VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Model S' AND manufacturer = 'Tesla' LIMIT 1), 'https://picsum.photos/600/360?random=101'),
((SELECT model_id FROM car_models WHERE model_name = 'Model S' AND manufacturer = 'Tesla' LIMIT 1), 'https://picsum.photos/600/360?random=102'),
((SELECT model_id FROM car_models WHERE model_name = 'Model S' AND manufacturer = 'Tesla' LIMIT 1), 'https://picsum.photos/600/360?random=103');

-- Insert Images for Nissan Leaf
INSERT INTO car_model_images (model_id, image_url) VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Leaf' AND manufacturer = 'Nissan' LIMIT 1), 'https://picsum.photos/600/360?random=104'),
((SELECT model_id FROM car_models WHERE model_name = 'Leaf' AND manufacturer = 'Nissan' LIMIT 1), 'https://picsum.photos/600/360?random=105'),
((SELECT model_id FROM car_models WHERE model_name = 'Leaf' AND manufacturer = 'Nissan' LIMIT 1), 'https://picsum.photos/600/360?random=106');

-- Insert Images for Ford Mustang
INSERT INTO car_model_images (model_id, image_url) VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Mustang' AND manufacturer = 'Ford' LIMIT 1), 'https://picsum.photos/600/360?random=107'),
((SELECT model_id FROM car_models WHERE model_name = 'Mustang' AND manufacturer = 'Ford' LIMIT 1), 'https://picsum.photos/600/360?random=108'),
((SELECT model_id FROM car_models WHERE model_name = 'Mustang' AND manufacturer = 'Ford' LIMIT 1), 'https://picsum.photos/600/360?random=109');

-- Insert Images for BMW X5
INSERT INTO car_model_images (model_id, image_url) VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'X5' AND manufacturer = 'BMW' LIMIT 1), 'https://picsum.photos/600/360?random=110'),
((SELECT model_id FROM car_models WHERE model_name = 'X5' AND manufacturer = 'BMW' LIMIT 1), 'https://picsum.photos/600/360?random=111'),
((SELECT model_id FROM car_models WHERE model_name = 'X5' AND manufacturer = 'BMW' LIMIT 1), 'https://picsum.photos/600/360?random=112');

-- Insert Images for Toyota Prius
INSERT INTO car_model_images (model_id, image_url) VALUES 
((SELECT model_id FROM car_models WHERE model_name = 'Prius' AND manufacturer = 'Toyota' LIMIT 1), 'https://picsum.photos/600/360?random=113'),
((SELECT model_id FROM car_models WHERE model_name = 'Prius' AND manufacturer = 'Toyota' LIMIT 1), 'https://picsum.photos/600/360?random=114'),
((SELECT model_id FROM car_models WHERE model_name = 'Prius' AND manufacturer = 'Toyota' LIMIT 1), 'https://picsum.photos/600/360?random=115');

-- Insert Reservations (3 Active, 7 Completed)
-- Active Reservations
INSERT INTO reservations (user_id, car_id, start_date, end_date, status) VALUES
((SELECT user_id FROM users WHERE email = 'john.doe@example.com'), (SELECT car_id FROM cars WHERE vin = '5YJSA1E26MF1S001'), '2024-01-01', '2025-01-01', 'Active'),
((SELECT user_id FROM users WHERE email = 'jane.smith@example.com'), (SELECT car_id FROM cars WHERE vin = '1N4BZ1E26MC1002'), '2024-02-01', '2025-02-01', 'Active'),
((SELECT user_id FROM users WHERE email = 'alice.johnson@example.com'), (SELECT car_id FROM cars WHERE vin = '1FA6P8JZ0K555003'), '2024-03-01', '2025-03-01', 'Active');

-- Completed Reservations
INSERT INTO reservations (user_id, car_id, start_date, end_date, status) VALUES
((SELECT user_id FROM users WHERE email = 'robert.taylor@example.com'), (SELECT car_id FROM cars WHERE vin = '5UXKR0C55KLE9004'), '2023-01-01', '2024-01-01', 'Completed'),
((SELECT user_id FROM users WHERE email = 'emily.davis@example.com'), (SELECT car_id FROM cars WHERE vin = 'JTDKB20U973502034'), '2023-02-01', '2024-02-01', 'Completed'),
((SELECT user_id FROM users WHERE email = 'michael.brown@example.com'), (SELECT car_id FROM cars WHERE vin = '5YJSA1E26MF1S001'), '2022-01-01', '2023-01-01', 'Completed'),
((SELECT user_id FROM users WHERE email = 'sarah.miller@example.com'), (SELECT car_id FROM cars WHERE vin = '1N4BZ1E26MC1002'), '2022-02-01', '2023-02-01', 'Completed'),
((SELECT user_id FROM users WHERE email = 'grace.hall@example.com'), (SELECT car_id FROM cars WHERE vin = '1FA6P8JZ0K555003'), '2022-03-01', '2023-03-01', 'Completed'),
((SELECT user_id FROM users WHERE email = 'noah.king@example.com'), (SELECT car_id FROM cars WHERE vin = '5UXKR0C55KLE9004'), '2021-01-01', '2022-01-01', 'Completed'),
((SELECT user_id FROM users WHERE email = 'chloe.young@example.com'), (SELECT car_id FROM cars WHERE vin = 'JTDKB20U973502034'), '2021-02-01', '2022-02-01', 'Completed');

-- Insert Payments for Active Reservations (Stripe)
INSERT INTO payments (reservation_id, amount, stripe_payment_id) VALUES
((SELECT reservation_id FROM reservations WHERE user_id = (SELECT user_id FROM users WHERE email = 'john.doe@example.com') AND car_id = (SELECT car_id FROM cars WHERE vin = '5YJSA1E26MF1S001')), 1200.00, 'pi_1GqIC8L5hMWdVSmIC4BtjR8k'),
((SELECT reservation_id FROM reservations WHERE user_id = (SELECT user_id FROM users WHERE email = 'jane.smith@example.com') AND car_id = (SELECT car_id FROM cars WHERE vin = '1N4BZ1E26MC1002')), 900.00, 'pi_1GqIC8L5hMWdVSmIC4BtjR8l'),
((SELECT reservation_id FROM reservations WHERE user_id = (SELECT user_id FROM users WHERE email = 'alice.johnson@example.com') AND car_id = (SELECT car_id FROM cars WHERE vin = '1FA6P8JZ0K555003')), 700.00, 'pi_1GqIC8L5hMWdVSmIC4BtjR8m'),
((SELECT reservation_id FROM reservations WHERE user_id = (SELECT user_id FROM users WHERE email = 'robert.taylor@example.com') AND car_id = (SELECT car_id FROM cars WHERE vin = '5UXKR0C55KLE9004')), 1100.00, 'pi_1GqIC8L5hMWdVSmIC4BtjR8n'),
((SELECT reservation_id FROM reservations WHERE user_id = (SELECT user_id FROM users WHERE email = 'emily.davis@example.com') AND car_id = (SELECT car_id FROM cars WHERE vin = 'JTDKB20U973502034')), 600.00, 'pi_1GqIC8L5hMWdVSmIC4BtjR8o'),
((SELECT reservation_id FROM reservations WHERE user_id = (SELECT user_id FROM users WHERE email = 'michael.brown@example.com') AND car_id = (SELECT car_id FROM cars WHERE vin = '5YJSA1E26MF1S001')), 1300.00, 'pi_1GqIC8L5hMWdVSmIC4BtjR8p'),
((SELECT reservation_id FROM reservations WHERE user_id = (SELECT user_id FROM users WHERE email = 'sarah.miller@example.com') AND car_id = (SELECT car_id FROM cars WHERE vin = '1N4BZ1E26MC1002')), 800.00, 'pi_1GqIC8L5hMWdVSmIC4BtjR8q');

-- Insert Pricing for Tesla Model S
-- 12 Months, 1000 KM, Fixed Package, Basic Insurance
INSERT INTO pricing (
    car_id, 
    duration_id, 
    package_type_id, 
    mileage_plan_id, 
    monthly_payment, 
    deposit, 
    excess_mileage_fee, 
    insurance_package_id, 
    administration_fee
) VALUES (
    (SELECT car_id FROM cars WHERE vin = '5YJSA1E26MF1S001' LIMIT 1),  -- Tesla Model S
    (SELECT duration_id FROM subscription_durations WHERE months = 12 LIMIT 1),  -- 12-month duration
    (SELECT package_type_id FROM package_types WHERE package_name = 'fixed' LIMIT 1),  -- Fixed package
    (SELECT plan_id FROM mileage_plans WHERE kilometers = 1000 LIMIT 1),  -- 1000 KM mileage plan
    1200.00,  -- Base Monthly payment (€)
    2000.00,  -- Deposit (€)
    0.20,  -- Excess mileage fee (€ per KM)
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'BASIC' LIMIT 1),  -- Basic insurance
    50.00  -- Administration fee (€)
);

-- Insert Pricing for Nissan Leaf
-- 24 Months, 750 KM, Flexible Package, Minimum Insurance
INSERT INTO pricing (
    car_id, 
    duration_id, 
    package_type_id, 
    mileage_plan_id, 
    monthly_payment, 
    deposit, 
    excess_mileage_fee, 
    insurance_package_id, 
    administration_fee
) VALUES (
    (SELECT car_id FROM cars WHERE vin = '1N4BZ1E26MC1002' LIMIT 1),  -- Nissan Leaf
    (SELECT duration_id FROM subscription_durations WHERE months = 24 LIMIT 1),  -- 24-month duration
    (SELECT package_type_id FROM package_types WHERE package_name = 'flexible' LIMIT 1),  -- Flexible package
    (SELECT plan_id FROM mileage_plans WHERE kilometers = 750 LIMIT 1),  -- 750 KM mileage plan
    900.00,  -- Base Monthly payment (€)
    1500.00,  -- Deposit (€)
    0.15,  -- Excess mileage fee (€ per KM)
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'MINIMUM' LIMIT 1),  -- Minimum insurance
    40.00  -- Administration fee (€)
);

-- Insert Pricing for Ford Mustang
-- 6 Months, 2500 KM, Fixed Package, Premium Insurance
INSERT INTO pricing (
    car_id, 
    duration_id, 
    package_type_id, 
    mileage_plan_id, 
    monthly_payment, 
    deposit, 
    excess_mileage_fee, 
    insurance_package_id, 
    administration_fee
) VALUES (
    (SELECT car_id FROM cars WHERE vin = '1FA6P8JZ0K555003' LIMIT 1),  -- Ford Mustang
    (SELECT duration_id FROM subscription_durations WHERE months = 6 LIMIT 1),  -- 6-month duration
    (SELECT package_type_id FROM package_types WHERE package_name = 'fixed' LIMIT 1),  -- Fixed package
    (SELECT plan_id FROM mileage_plans WHERE kilometers = 2500 LIMIT 1),  -- 2500 KM mileage plan
    1500.00,  -- Base Monthly payment (€)
    2500.00,  -- Deposit (€)
    0.30,  -- Excess mileage fee (€ per KM)
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'PREMIUM' LIMIT 1),  -- Premium insurance
    60.00  -- Administration fee (€)
);

-- Insert Pricing for BMW X5
-- 36 Months, 1750 KM, Flexible Package, Basic Insurance
INSERT INTO pricing (
    car_id, 
    duration_id, 
    package_type_id, 
    mileage_plan_id, 
    monthly_payment, 
    deposit, 
    excess_mileage_fee, 
    insurance_package_id, 
    administration_fee
) VALUES (
    (SELECT car_id FROM cars WHERE vin = '5UXKR0C55KLE9004' LIMIT 1),  -- BMW X5
    (SELECT duration_id FROM subscription_durations WHERE months = 36 LIMIT 1),  -- 36-month duration
    (SELECT package_type_id FROM package_types WHERE package_name = 'flexible' LIMIT 1),  -- Flexible package
    (SELECT plan_id FROM mileage_plans WHERE kilometers = 1750 LIMIT 1),  -- 1750 KM mileage plan
    1100.00,  -- Base Monthly payment (€)
    1800.00,  -- Deposit (€)
    0.25,  -- Excess mileage fee (€ per KM)
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'BASIC' LIMIT 1),  -- Basic insurance
    55.00  -- Administration fee (€)
);

-- Insert Pricing for Toyota Prius
-- 48 Months, 3000 KM, Fixed Package, Minimum Insurance
INSERT INTO pricing (
    car_id, 
    duration_id, 
    package_type_id, 
    mileage_plan_id, 
    monthly_payment, 
    deposit, 
    excess_mileage_fee, 
    insurance_package_id, 
    administration_fee
) VALUES (
    (SELECT car_id FROM cars WHERE vin = 'JTDKB20U973502034' LIMIT 1),  -- Toyota Prius
    (SELECT duration_id FROM subscription_durations WHERE months = 48 LIMIT 1),  -- 48-month duration
    (SELECT package_type_id FROM package_types WHERE package_name = 'fixed' LIMIT 1),  -- Fixed package
    (SELECT plan_id FROM mileage_plans WHERE kilometers = 3000 LIMIT 1),  -- 3000 KM mileage plan
    800.00,  -- Base Monthly payment (€)
    1200.00,  -- Deposit (€)
    0.10,  -- Excess mileage fee (€ per KM)
    (SELECT insurance_package_id FROM insurance_packages WHERE package_name = 'MINIMUM' LIMIT 1),  -- Minimum insurance
    50.00  -- Administration fee (€)
);

-- Link Tesla Model S to its different pricing options
INSERT INTO car_pricing (car_id, pricing_id)
VALUES 
((SELECT car_id FROM cars WHERE vin = '5YJSA1E26MF1S001'), 
 (SELECT pricing_id FROM pricing WHERE car_id = (SELECT car_id FROM cars WHERE vin = '5YJSA1E26MF1S001') AND duration_id = (SELECT duration_id FROM subscription_durations WHERE months = 12) LIMIT 1));


