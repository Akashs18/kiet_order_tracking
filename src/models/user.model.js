const db = require('../config/db');

exports.findByEmail =(email)=>{
return db.query('select * from user where email = $1',[email]);
};

exports.createUser = (name,email,password,role) =>{
    return db.query(
        'insert into user (name,email,password,role) value ($1,$2,$3,$4)',
        [name,email,password,role]
    );
};