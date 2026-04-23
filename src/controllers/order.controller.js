const orderModel = require('../models/order.model');
const orderFileModel = require('../models/orderFile.model');
const supplierModel = require('../models/supplier.model');
const ticketModel = require('../models/ticket.model');
const emailService = require('../services/email.service');
const fs = require('fs');
const path = require('path');

exports.getOrders = async (req, res) => {
    let result;
    let suppliers = [];
    let tickets = [];
    const searchQuery = req.query.search ? req.query.search.trim() : '';

    if (req.session.user.role === 'ADMIN') {
        if (searchQuery) {
            result = await orderModel.search(searchQuery);
        } else {
            result = await orderModel.getAll();
        }
        // Fetch suppliers for dropdown in create order form
        const suppliersResult = await supplierModel.getAll();
        suppliers = suppliersResult.rows;
    } else {
        if (searchQuery) {
            result = await orderModel.searchByEmail(req.session.user.email, searchQuery);
        } else {
            result = await orderModel.getByEmail(req.session.user.email);
        }
    }

    // Fetch tickets - admins see all, clients see only theirs
    let ticketsResult;
    if (req.session.user.role === 'ADMIN') {
        ticketsResult = await ticketModel.getAll();
    } else {
        ticketsResult = await ticketModel.getByUserId(req.session.user.id);
    }
    tickets = ticketsResult.rows;

    res.render('orders/index', { orders: result.rows, user: req.session.user, searchQuery, suppliers, tickets });
};

exports.getOrderById = async (req, res) => {
    const result = await orderModel.getById(req.params.id);
    const order = result.rows[0];
    
    if (!order) {
        return res.status(404).send('Order not found');
    }

    const filesResult = await orderFileModel.getByOrderId(req.params.id);
    const files = filesResult.rows;

    res.render('orders/detail', { order, user: req.session.user, files });
};

exports.uploadFile = async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        return res.redirect(`/orders/${id}?error=No+file+selected`);
    }

    await orderFileModel.addFile(
        id,
        req.file.originalname,
        req.file.filename,
        req.file.mimetype,
        req.file.size,
        req.session.user.email
    );

    res.redirect(`/orders/${id}`);
};

exports.deleteFile = async (req, res) => {
    const { id, fileId } = req.params;

    const result = await orderFileModel.getById(fileId);
    const file = result.rows[0];

    if (file) {
        const filePath = path.join(__dirname, '../../public/uploads/orders', file.stored_name);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
        await orderFileModel.deleteById(fileId);
    }

    res.redirect(`/orders/${id}`);
};

exports.createOrder = async (req, res) => {
    const { po_number, supplier_name, client_email, expected_delivery_date } = req.body;

    const result = await orderModel.create(po_number, supplier_name, client_email, expected_delivery_date);
    const order = result.rows[0];

    // Send welcome/order created email
    await emailService.sendOrderNotification(
        order.client_email,
        {
            name: order.client_name || 'Valued Customer'
        },
        {
            orderId: order.po_number,
            status: 'PENDING',
            supplierName: supplier_name,
            deliveryDate: expected_delivery_date ? new Date(expected_delivery_date).toLocaleDateString() : 'N/A',
        }
    );

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
    if (status === 'DELIVERED') field = 'delivered_at';

    const result = await orderModel.updateStatus(id, status, field);
    const order = result.rows[0];

    // Send formatted HTML email with order details
    await emailService.sendOrderNotification(
        order.client_email,
        {
            name: order.client_name || 'Valued Customer'
        },
        {
            orderId: order.po_number,
            status: status,
            supplierName: order.supplier_name,
            deliveryDate: order.expected_delivery_date ? new Date(order.expected_delivery_date).toLocaleDateString() : 'N/A',
            totalAmount: order.total_amount || 0
        }
    );

    res.redirect(`/orders/${id}`);
};