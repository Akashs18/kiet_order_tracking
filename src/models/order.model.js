const db = require('../config/db');
const statusConfig = require('../utils/statusConfig');

exports.create = (po, supplierName, email, clientName, expectedDeliveryDate, orderType = 'TRADING', productName = '', description = '') => {
    return db.query(
        `insert into orders (po_number, supplier_name, client_email, client_name, status, expected_delivery_date, order_type, product_name, description)
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`,
        [po, supplierName, email, clientName, statusConfig.getSteps(orderType)[0], expectedDeliveryDate, orderType, productName, description]
    );
};

exports.getAll = () => db.query('select * from orders order by created_at desc');

exports.getByEmail = (email) => db.query('select * from orders where client_email = $1 order by created_at desc', [email]);

exports.getById = (id) => db.query('select * from orders where id = $1', [id]);

exports.search = (searchQuery) => {
    const query = `%${searchQuery}%`;
    return db.query(
        'select * from orders where po_number ILIKE $1 or supplier_name ILIKE $1 order by created_at desc',
        [query]
    );
};

exports.searchByEmail = (email, searchQuery) => {
    const query = `%${searchQuery}%`;
    return db.query(
        'select * from orders where client_email = $1 and (po_number ILIKE $2 or supplier_name ILIKE $2) order by created_at desc',
        [email, query]
    );
};

exports.updateStatus = async (id, status, oldStatus, orderType) => {
    const steps = statusConfig.getSteps(orderType);
    const statusIndex = steps.indexOf(status);

    if (statusIndex === -1) throw new Error('Invalid status');

    // 1. Update the main status in orders table
    const result = await db.query(
        'update orders set status = $1 where id = $2 returning *',
        [status, id]
    );

    // 2. Record the completion in order_tracking_steps
    await db.query(`
        INSERT INTO order_tracking_steps (order_id, step_name, completed_at)
        VALUES ($1, $2, CURRENT_TIMESTAMP)
        ON CONFLICT (order_id, step_name) DO UPDATE SET completed_at = CURRENT_TIMESTAMP
    `, [id, status]);

    // 3. Optional: Clear future steps if we are moving backward? 
    // For now, let's keep it simple. If statusIndex is less than current index, we might want to clear future steps.
    // But usually in business, once a step is done, it's done. 
    // If the user wants to "undo", they can just set it back.
    
    // Clear future steps if moving backwards
    const oldStatusIndex = steps.indexOf(oldStatus);
    if (statusIndex < oldStatusIndex) {
        const futureSteps = steps.slice(statusIndex + 1);
        if (futureSteps.length > 0) {
            await db.query(`
                DELETE FROM order_tracking_steps 
                WHERE order_id = $1 AND step_name = ANY($2)
            `, [id, futureSteps]);
        }
    }

    return result;
};

exports.getTrackingSteps = (orderId) => {
    return db.query(
        'SELECT step_name, completed_at FROM order_tracking_steps WHERE order_id = $1 ORDER BY completed_at ASC',
        [orderId]
    );
};



