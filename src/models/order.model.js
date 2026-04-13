const db = require('../config/db');

exports.create =(po,email) =>{
    return db.query(
        `insert into orders (po_number,client_email,status)
        value($1,$2,pending) returning *`,
        [po,email]
    );
};

exports.getAll =()=> db.query('select * from orders');

exports.getByEmail =(email) => db.query('select * from orders where client_email',[email]);

exports.updateStatus =(id,status,field)=>{
    return db.query(
        `update order set status=-$1, ${field}=current_timestamp where id=$2 returning *`,
        [status,id]
    );
};

