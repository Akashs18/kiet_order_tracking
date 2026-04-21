require('dotenv').config();
const db = require('./src/config/db');

async function run() {
    try {
        await db.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_email VARCHAR(255);');
        await db.query('ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_delivery_date DATE;');
        console.log('Successfully added missing columns to orders table.');
    } catch(err) {
        console.error('Error adding client_email:', err);
    } finally {
        process.exit();
    }
}
run();
