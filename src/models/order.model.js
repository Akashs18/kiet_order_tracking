const db = require('../config/db');

exports.create =(po,email) =>{
    return db.query(
        `insert into orders (po_number,client_email,status)
        values ($1, $2, 'PENDING') returning *`,
        [po,email]
    );
};

exports.getAll =()=> db.query('select * from orders');

exports.getByEmail =(email) => db.query('select * from orders where client_email = $1',[email]);

exports.getById = (id) => db.query('select * from orders where id = $1', [id]);

exports.updateStatus =(id,status,field)=>{
    return db.query(
        `update orders set status=$1, ${field}=current_timestamp where id=$2 returning *`,
        [status,id]
    );
};

