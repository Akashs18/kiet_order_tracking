const {Pool}= require('pg');

const pool= new Pool({
    user:process.env.DB_USER,
    password:process.env.pass,
    database:process.env.DB_NAME,
    host:'localhost',
    port:5432,
});

module.exports = pool;