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

exports.updateStatus =(id,status,field)=>{
    if (field) {
        return db.query(
            `update orders set status=$1, ${field}=current_timestamp where id=$2 returning *`,
            [status,id]
        );
    } else {
        return db.query(
            `update orders set status=$1 where id=$2 returning *`,
            [status,id]
        );
    }
};

