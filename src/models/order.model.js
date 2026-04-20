const db = require('../config/db');

exports.create =(po,supplierName,email,expectedDeliveryDate) =>{
    return db.query(
        `insert into orders (po_number,supplier_name,client_email,status,expected_delivery_date)
        values ($1, $2, $3, 'PENDING', $4) returning *`,
        [po,supplierName,email,expectedDeliveryDate]
    );
};

exports.getAll =()=> db.query('select * from orders');

exports.getByEmail =(email) => db.query('select * from orders where client_email = $1',[email]);

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

exports.updateStatus =(id,status,field)=>{
    let clearFields = '';
    const statuses = ['PENDING', 'ORDERED', 'RECEIVED', 'INVOICED', 'DISPATCHED', 'DELIVERED'];
    const statusIndex = statuses.indexOf(status);
    
    if (statusIndex > 0) {
        // Clear timestamps for statuses after the current one
        const fieldsToClear = statuses.slice(statusIndex + 1).map(s => s.toLowerCase() + '_at');
        if (fieldsToClear.length > 0) {
            clearFields = ', ' + fieldsToClear.map(f => `${f} = NULL`).join(', ');
        }
    } else if (status === 'PENDING') {
        // For PENDING, clear all timestamps
        clearFields = ', ordered_at = NULL, received_at = NULL, invoiced_at = NULL, dispatched_at = NULL, delivered_at = NULL';
    }

    if (field) {
        return db.query(
            `update orders set status=$1, ${field}=current_timestamp${clearFields} where id=$2 returning *`,
            [status,id]
        );
    } else {
        return db.query(
            `update orders set status=$1${clearFields} where id=$2 returning *`,
            [status,id]
        );
    }
};


