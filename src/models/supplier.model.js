const db = require('../config/db');

exports.getAll = () => {
    return db.query('select * from suppliers order by name asc');
};

exports.getById = (id) => {
    return db.query('select * from suppliers where id = $1', [id]);
};

exports.create = (name, email, phone, address) => {
    return db.query(
        'insert into suppliers (name, email, phone, address) values ($1, $2, $3, $4) returning *',
        [name, email, phone, address]
    );
};

exports.update = (id, name, email, phone, address) => {
    return db.query(
        'update suppliers set name = $1, email = $2, phone = $3, address = $4 where id = $5 returning *',
        [name, email, phone, address, id]
    );
};

exports.delete = (id) => {
    return db.query('delete from suppliers where id = $1 returning *', [id]);
};
