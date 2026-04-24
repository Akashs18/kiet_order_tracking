require('dotenv').config();
const db = require('./src/config/db');

async function migrate() {
    try {
        console.log('Adding client_name column...');
        await db.query(`ALTER TABLE orders ADD COLUMN IF NOT EXISTS client_name VARCHAR(255)`);
        console.log('Migration successful.');
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

migrate();
