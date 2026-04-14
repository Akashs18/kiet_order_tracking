const db = require('../config/db');

exports.findByEmail =(email)=>{
return db.query('select * from users where email = $1',[email]);
};

exports.createUser = (name,email,password,role) =>{
    return db.query(
        'insert into users (name,email,password,role) values ($1,$2,$3,$4)',
        [name,email,password,role]
    );
};