const db = require('./src/config/db');

async function run() {
    try {
        await db.query('ALTER TABLE orders ADD COLUMN expected_delivery_date DATE;');
        console.log('Successfully added expected_delivery_date column to orders table.');
    } catch(err) {
        if(err.code === '42701') {
            console.log('Column already exists.');
        } else {
            console.error('Error:', err);
        }
    } finally {
        process.exit();
    }
}
run();
