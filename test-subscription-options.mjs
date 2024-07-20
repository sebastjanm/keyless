import pkg from 'pg';
const { Pool } = pkg;

// Replace these values with your actual database connection settings from server.js
const pool = new Pool({
    user: 'postgres.mcqwmcatahnptwuonghp',
    host: 'aws-0-eu-central-1.pooler.supabase.com',
    database: 'postgres',
    password: '97QgW3kt6UH9xM@',
    port: 6543,
});


async function getSubscriptionOptions() {
  const locationsQuery = `
      SELECT name 
      FROM locations
  `;

  const insurancePackagesQuery = `
      SELECT unnest(enum_range(NULL::insurance_package_type)) AS insurance_package
  `;

  const subscriptionLengthsQuery = `
      SELECT length 
      FROM subscription_length
  `;

  const subscriptionMileageQuery = `
      SELECT mileage 
      FROM subscription_mileage
  `;

  try {
      const locationsResult = await pool.query(locationsQuery);
      console.log('Locations Result:', locationsResult.rows); // Debugging log

      const insurancePackagesResult = await pool.query(insurancePackagesQuery);
      console.log('Insurance Packages Result:', insurancePackagesResult.rows); // Debugging log

      const subscriptionLengthsResult = await pool.query(subscriptionLengthsQuery);
      console.log('Subscription Lengths Result:', subscriptionLengthsResult.rows); // Debugging log

      const subscriptionMileageResult = await pool.query(subscriptionMileageQuery);
      console.log('Subscription Mileage Result:', subscriptionMileageResult.rows); // Debugging log

      return {
          locations: locationsResult.rows.map(row => row.location_name),
          insurancePackages: insurancePackagesResult.rows.map(row => row.insurance_package),
          subscriptionLengths: subscriptionLengthsResult.rows.map(row => row.length),
          subscriptionMileages: subscriptionMileageResult.rows.map(row => row.mileage),
      };
  } catch (err) {
      console.error('Error fetching subscription options:', err);
      throw new Error('Database query failed.');
  }
}

(async () => {
  try {
    const options = await getSubscriptionOptions();
    console.log('Subscription Options:', options);
    pool.end();
  } catch (err) {
    console.error('Error:', err);
  }
})();
