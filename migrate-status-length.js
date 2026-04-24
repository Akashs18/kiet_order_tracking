require('dotenv').config();
const db = require('./src/config/db');

async function migrate() {
    try {
        console.log('Increasing length of orders.status column...');
        await db.query(`ALTER TABLE orders ALTER COLUMN status TYPE VARCHAR(100)`);
        console.log('Migration successful.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
