require('dotenv').config();
const db = require('./src/config/db');

async function migrate() {
    try {
        console.log('Starting migration...');

        // 1. Add order_type column to orders table
        await db.query(`
            ALTER TABLE orders 
            ADD COLUMN IF NOT EXISTS order_type VARCHAR(20) DEFAULT 'TRADING'
        `);
        console.log('Added order_type column to orders table.');

        // 2. Create order_tracking_steps table
        await db.query(`
            CREATE TABLE IF NOT EXISTS order_tracking_steps (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                step_name VARCHAR(100) NOT NULL,
                completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                UNIQUE(order_id, step_name)
            )
        `);
        console.log('Created order_tracking_steps table.');

        // 3. Migrate existing statuses to the new table
        const orders = await db.query('SELECT id, status, ordered_at, received_at, invoiced_at, dispatched_at, delivered_at FROM orders');
        
        for (const order of orders.rows) {
            const steps = [
                { name: 'PENDING', time: order.created_at || new Date() },
                { name: 'ORDERED', time: order.ordered_at },
                { name: 'RECEIVED', time: order.received_at },
                { name: 'INVOICED', time: order.invoiced_at },
                { name: 'DISPATCHED', time: order.dispatched_at },
                { name: 'DELIVERED', time: order.delivered_at }
            ];

            for (const step of steps) {
                if (step.time) {
                    await db.query(`
                        INSERT INTO order_tracking_steps (order_id, step_name, completed_at)
                        VALUES ($1, $2, $3)
                        ON CONFLICT (order_id, step_name) DO UPDATE SET completed_at = EXCLUDED.completed_at
                    `, [order.id, step.name, step.time]);
                }
            }
        }
        console.log('Migrated existing status timestamps.');

        console.log('Migration completed successfully!');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

migrate();
