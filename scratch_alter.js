require('dotenv').config();
const db = require('./src/config/db');

async function run() {
    try {
        console.log('Connecting to host:', process.env.DB_HOST);
        console.log('Database:', process.env.DB_DATABASE);

        // Add missing columns just in case
        await db.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_email VARCHAR(255);');
        await db.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_delivery_date DATE;');
        
        // Check existing columns in orders table
        const colCheck = await db.query(`
            SELECT column_name FROM information_schema.columns
            WHERE table_name = 'orders' ORDER BY column_name;
        `);
        console.log('Current columns in orders:', colCheck.rows.map(r => r.column_name).join(', '));

        console.log('Done.');
    } catch(err) {
        console.error('Error:', err.message);
    } finally {
        process.exit();
    }
}
run();
