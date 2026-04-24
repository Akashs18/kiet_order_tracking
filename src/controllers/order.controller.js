const orderModel = require('../models/order.model');
const orderFileModel = require('../models/orderFile.model');
const supplierModel = require('../models/supplier.model');
const ticketModel = require('../models/ticket.model');
const emailService = require('../services/email.service');
const statusConfig = require('../utils/statusConfig');
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

    // Calculate order type stats for dashboard
    const orders = result.rows;
    const orderStats = {
        trading: orders.filter(o => (o.order_type || 'TRADING') === 'TRADING').length,
        machinery: orders.filter(o => o.order_type === 'MACHINERY').length
    };

    res.render('orders/index', { 
        orders, 
        user: req.session.user, 
        searchQuery, 
        suppliers, 
        tickets, 
        ORDER_TYPES: statusConfig.ORDER_TYPES,
        orderStats
    });
};

exports.getOrderById = async (req, res) => {
    const result = await orderModel.getById(req.params.id);
    const order = result.rows[0];
    
    if (!order) {
        return res.status(404).send('Order not found');
    }

    const filesResult = await orderFileModel.getByOrderId(req.params.id);
    const files = filesResult.rows;

    // Fetch dynamic tracking steps
    const trackingStepsResult = await orderModel.getTrackingSteps(req.params.id);
    const trackingSteps = {};
    trackingStepsResult.rows.forEach(row => {
        trackingSteps[row.step_name] = row.completed_at;
    });

    const allSteps = statusConfig.getSteps(order.order_type || 'TRADING');

    res.render('orders/detail', { 
        order, 
        user: req.session.user, 
        files, 
        trackingSteps, 
        allSteps,
        query: req.query 
    });
};

exports.uploadFile = async (req, res) => {
    const { id } = req.params;

    if (!req.file) {
        return res.redirect(`/orders/${id}?error=No+file+selected`);
    }

    try {
        await orderFileModel.addFile(
            id,
            req.file.originalname,
            req.file.filename,
            req.file.mimetype,
            req.file.size,
            req.session.user.email
        );
        res.redirect(`/orders/${id}`);
    } catch (err) {
        console.error('uploadFile error:', err.message);
        res.redirect(`/orders/${id}?error=Upload+failed.+Please+try+again`);
    }
};

exports.deleteFile = async (req, res) => {
    const { id, fileId } = req.params;

    try {
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
    } catch (err) {
        console.error('deleteFile error:', err.message);
        res.redirect(`/orders/${id}?error=Delete+failed.+Please+try+again`);
    }
};

exports.createOrder = async (req, res) => {
    const { po_number, supplier_name, client_email, client_name, expected_delivery_date, order_type, product_name, description } = req.body;

    const result = await orderModel.create(po_number, supplier_name, client_email, client_name, expected_delivery_date, order_type, product_name, description);
    const newOrder = result.rows[0];

    // Initial tracking step for 'PENDING' or first step
    const steps = statusConfig.getSteps(order_type || 'TRADING');
    await orderModel.updateStatus(newOrder.id, steps[0], null, order_type || 'TRADING');

    res.redirect('/orders');
};

exports.updatestatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    const orderResult = await orderModel.getById(id);
    const order = orderResult.rows[0];

    if (!order) return res.status(404).send('Order not found');

    const result = await orderModel.updateStatus(id, status, order.status, order.order_type);
    const updatedOrder = result.rows[0];

    // Send formatted HTML email with order details
    try {
        await emailService.sendOrderNotification(
            updatedOrder.client_email,
            {
                name: updatedOrder.client_name || 'Valued Customer'
            },
            {
                orderId: updatedOrder.po_number,
                status: status,
                shippingDate: new Date().toLocaleDateString(),
                deliveryDate: updatedOrder.expected_delivery_date ? new Date(updatedOrder.expected_delivery_date).toLocaleDateString() : 'N/A',
                totalAmount: updatedOrder.total_amount || 0
            }
        );
    } catch (emailErr) {
        console.error('Email notification failed:', emailErr.message);
    }

    res.redirect(`/orders/${id}`);
};