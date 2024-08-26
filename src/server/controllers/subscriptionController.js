// subscriptionController.js
import pkg from 'pg';
import config from '../config.js';

const { Pool } = pkg;
const pool = new Pool(config.db);

// In subscriptionController.js

export async function getSubscriptionOptions(req, res) {
    try {
        const client = await pool.connect();

        const carId = req.query.carId;
        if (!carId) {
            console.error('No carId provided in request.');
            return res.status(400).json({ error: 'Car ID is required.' });
        }

        // Proceed with fetching data if carId is valid
        const colorsQuery = `SELECT color_name FROM colors;`;
        const colorsResult = await client.query(colorsQuery);

        const durationsQuery = `SELECT duration_id, months, price_modifier FROM subscription_durations;`;
        const durationsResult = await client.query(durationsQuery);

        const insurancePackagesQuery = `SELECT insurance_package_id, package_name, price_modifier FROM insurance_packages;`;
        const insurancePackagesResult = await client.query(insurancePackagesQuery);

        const mileagePlansQuery = `SELECT plan_id, kilometers, price_modifier FROM mileage_plans ORDER BY kilometers ASC;`;
        const mileagePlansResult = await client.query(mileagePlansQuery);

        const packageTypesQuery = `SELECT package_type_id, package_name, price_modifier FROM package_types;`;
        const packageTypesResult = await client.query(packageTypesQuery);

        const deliveryOptionsQuery = `SELECT option_id, option_name, price_modifier FROM delivery_options;`;
        const deliveryOptionsResult = await client.query(deliveryOptionsQuery);

        const pricingQuery = `
            SELECT 
                p.monthly_payment AS price, 
                p.deposit, 
                p.administration_fee,
                p.excess_mileage_fee,
                sd.months AS subscription_duration,
                ip.package_name AS insurance_package_name,
                mp.kilometers,
                pt.package_name AS package_type
            FROM pricing p
            JOIN subscription_durations sd ON p.duration_id = sd.duration_id
            JOIN insurance_packages ip ON p.insurance_package_id = ip.insurance_package_id
            JOIN mileage_plans mp ON p.mileage_plan_id = mp.plan_id
            JOIN package_types pt ON p.package_type_id = pt.package_type_id
            WHERE p.car_id = $1
            AND p.default_pricing = TRUE
            LIMIT 1;
        `;
        const pricingResult = await client.query(pricingQuery, [carId]);

        console.log(`Pricing result for carId ${carId}:`, pricingResult.rows);

        if (pricingResult.rows.length === 0) {
            console.warn(`No default pricing found for carId: ${carId}`);
        }

        const subscriptionOptions = {
            colors: colorsResult.rows,
            subscriptionDurations: durationsResult.rows,
            insurancePackages: insurancePackagesResult.rows,
            mileagePlans: mileagePlansResult.rows,
            packageTypes: packageTypesResult.rows,
            deliveryOptions: deliveryOptionsResult.rows,
            pricing: pricingResult.rows,
        };

        console.log("Subscription options being sent:", subscriptionOptions);

        client.release();
        res.json(subscriptionOptions);
    } catch (error) {
        console.error('Error fetching subscription options:', error.message);
        res.status(500).json({ error: 'Failed to fetch subscription options', details: error.message });
    }
}





export async function calculatePricing(req, res) {
    const { carModel, manufacturer, minTerm, mileagePlan, insurancePackage, packageType } = req.body;

    try {
        const client = await pool.connect();

        const pricingQuery = `
            SELECT 
                p.monthly_payment AS "Base Monthly Payment",
                COALESCE(sd.price_modifier, 0) AS "Subscription Modifier",
                COALESCE(mp.price_modifier, 0) AS "Mileage Modifier",
                COALESCE(ip.price_modifier, 0) AS "Insurance Modifier",
                COALESCE(pt.price_modifier, 0) AS "Package Modifier",
                (p.monthly_payment + 
                COALESCE(sd.price_modifier, 0) + 
                COALESCE(mp.price_modifier, 0) + 
                COALESCE(ip.price_modifier, 0) + 
                COALESCE(pt.price_modifier, 0)) AS "Final Monthly Payment",
                p.deposit,
                p.excess_mileage_fee,
                p.administration_fee
            FROM 
                pricing p
            INNER JOIN 
                subscription_durations sd ON p.duration_id = sd.duration_id
            INNER JOIN 
                mileage_plans mp ON p.mileage_plan_id = mp.plan_id
            INNER JOIN 
                insurance_packages ip ON p.insurance_package_id = ip.insurance_package_id
            INNER JOIN 
                package_types pt ON p.package_type_id = pt.package_type_id
            INNER JOIN 
                cars c ON p.car_id = c.car_id
            INNER JOIN 
                car_models cm ON c.model_id = cm.model_id
            WHERE 
                cm.model_name = $1
                AND cm.manufacturer = $2
                AND sd.months = $3
                AND mp.kilometers = $4
                AND ip.package_name = $5
                AND pt.package_name = $6
            LIMIT 1;
        `;

        const result = await client.query(pricingQuery, [
            carModel, 
            manufacturer, 
            minTerm, 
            mileagePlan, 
            insurancePackage, 
            packageType
        ]);

        client.release();

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Pricing not found for the selected options' });
        }
    } catch (error) {
        console.error('Error calculating pricing:', error.message);
        res.status(500).json({ error: 'Failed to calculate pricing', details: error.message });
    }
}






