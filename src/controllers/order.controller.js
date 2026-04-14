const orderModel = require('../models/order.model');
const emailService = require('../services/email.service');

exports.getOrders = async (req, res) => {
    let result;

    if (req.session.user.role === 'ADMIN') {
        result = await orderModel.getAll();
    } else {
        result = await orderModel.getByEmail(req.session.user.email);
    }

    res.render('orders/index', { orders: result.rows, user: req.session.user });
};

exports.getOrderById = async (req, res) => {
    const result = await orderModel.getById(req.params.id);
    const order = result.rows[0];
    
    if (!order) {
        return res.status(404).send('Order not found');
    }

    res.render('orders/detail', { order, user: req.session.user });
};

exports.createOrder = async (req, res) => {
    const { po_number, client_email } = req.body;

    await orderModel.create(po_number, client_email);

    res.redirect('/orders');
};

exports.updatestatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    let field = '';
    if (status === 'ORDERED') field = 'ordered_at';
    if (status === 'RECEIVED') field = 'received_at';
    if (status === 'INVOICED') field = 'invoiced_at';
    if (status === 'DISPATCHED') field = 'dispatched_at';

    const result = await orderModel.updateStatus(id, status, field);

    emailService.sendEmail(
        result.rows[0].client_email,
        'order update',
        `status changed to ${status}`
    );

    res.redirect('/orders');
};