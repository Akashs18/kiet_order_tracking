require('dotenv').config();
const db = require('./src/config/db');

async function checkLengths() {
    try {
        const res = await db.query(`
            SELECT column_name, character_maximum_length, table_name
            FROM information_schema.columns 
            WHERE (table_name = 'orders' AND column_name = 'status')
               OR (table_name = 'order_tracking_steps' AND column_name = 'step_name')
        `);
        res.rows.forEach(row => {
            console.log(`Table: ${row.table_name}, Column: ${row.column_name}, Max Length: ${row.character_maximum_length}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkLengths();
