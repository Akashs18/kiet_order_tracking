const db = require('../config/db');

exports.create = (userId, title, description, priority) => {
    return db.query(
        'insert into tickets (user_id, title, description, priority, status) values ($1, $2, $3, $4, $5) returning *',
        [userId, title, description, priority, 'OPEN']
    );
};

exports.getAll = () => {
    return db.query(
        'select t.*, u.email, u.name from tickets t join users u on t.user_id = u.id order by t.created_at desc'
    );
};

exports.getByUserId = (userId) => {
    return db.query(
        'select * from tickets where user_id = $1 order by created_at desc',
        [userId]
    );
};

exports.getById = (id) => {
    return db.query(
        'select t.*, u.email, u.name from tickets t join users u on t.user_id = u.id where t.id = $1',
        [id]
    );
};

exports.updateStatus = (id, status) => {
    return db.query(
        'update tickets set status = $1, updated_at = current_timestamp where id = $2 returning *',
        [status, id]
    );
};

exports.addComment = (ticketId, userId, comment) => {
    return db.query(
        'insert into ticket_comments (ticket_id, user_id, comment) values ($1, $2, $3) returning *',
        [ticketId, userId, comment]
    );
};

exports.getComments = (ticketId) => {
    return db.query(
        'select tc.*, u.email, u.name from ticket_comments tc join users u on tc.user_id = u.id where tc.ticket_id = $1 order by tc.created_at asc',
        [ticketId]
    );
};
