const orderModel = require('../models/order.model');
const emailService = require('../services/email.service');

exports.orderModel = async(req,res) =>{
    let result;

    if(req.session.user.role=='ADMIN'){
        result = await orderModel.getAll();
    }
    else{
        result = await orderModel.getByEmail(req.session.user.email);
    }
    res.render('order/index',{order:result.rows});
};

exports.createOrder = async (req,res)=>{
    const {po_number,client_email}= req.body;

    await orderModel.create(po_number,client_email);

    res.redirect('/orders');

};

exports.updateOrders =async (req,res)=>{
    const{id} =req.params;

    const {status}=req.body;

    let field ='';

    if (status === 'ORDERED') field = 'ordered_at';
    if (status === 'RECIVED') field = 'recived_at';
    if (status === 'invoice') field = 'invoiced_at';

    const result = await orderModel.updateStatus(id,status,field);

    emailService.sendEmail(
        result.row[0].client_email,
        'order update',
        `status change to ${status}`
    );

    res.redirect('/orders');

};