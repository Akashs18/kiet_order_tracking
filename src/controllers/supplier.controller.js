const supplierModel = require('../models/supplier.model');
const orderModel = require('../models/order.model');

exports.getAll = async (req, res) => {
    try {
        const suppliersResult = await supplierModel.getAll();
        const ordersResult = await orderModel.getAll();
        res.render('orders/index', { 
            suppliers: suppliersResult.rows, 
            orders: ordersResult.rows,
            user: req.session.user, 
            searchQuery: '',
            tab: 'suppliers'
        });
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        res.status(500).send('Error fetching suppliers');
    }
};

exports.create = async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        if (!name) return res.status(400).send('Supplier name is required');
        await supplierModel.create(name, email || null, phone || null, address || null);
        res.redirect('/suppliers');
    } catch (error) {
        console.error('Error creating supplier:', error);
        res.status(500).send('Error creating supplier');
    }
};

exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, phone, address } = req.body;
        if (!name) return res.status(400).send('Supplier name is required');
        await supplierModel.update(id, name, email || null, phone || null, address || null);
        res.redirect('/suppliers');
    } catch (error) {
        console.error('Error updating supplier:', error);
        res.status(500).send('Error updating supplier');
    }
};

exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        await supplierModel.delete(id);
        res.redirect('/suppliers');
    } catch (error) {
        console.error('Error deleting supplier:', error);
        res.status(500).send('Error deleting supplier');
    }
};
