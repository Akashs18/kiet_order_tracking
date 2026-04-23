const db = require('../config/db');

exports.addFile = (orderId, originalName, storedName, mimeType, sizeBytes, uploadedBy) => {
    return db.query(
        `INSERT INTO order_files (order_id, original_name, stored_name, mime_type, size_bytes, uploaded_by)
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [orderId, originalName, storedName, mimeType, sizeBytes, uploadedBy]
    );
};

exports.getByOrderId = (orderId) => {
    return db.query(
        `SELECT * FROM order_files WHERE order_id = $1 ORDER BY uploaded_at DESC`,
        [orderId]
    );
};

exports.getById = (fileId) => {
    return db.query(
        `SELECT * FROM order_files WHERE id = $1`,
        [fileId]
    );
};

exports.deleteById = (fileId) => {
    return db.query(
        `DELETE FROM order_files WHERE id = $1 RETURNING *`,
        [fileId]
    );
};
