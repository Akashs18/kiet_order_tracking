const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

exports.register =async (req,res) =>{
    const[name,email,password,role] =req.body; 

    const hashed =await bcrypt.hash(password,10);

    await userModel.createUser(name,email,hashed,role);

    res.redirect('/auth/login');
      
};

exports.login = async (req,res)=>{
    const{email, password} =req.body;

    const result = await userModel.findByEmail(email);

    const user = result.rows[0];

if(!user) return res.send(`user not found`);

const vaild= await bcrypt.compare(password,user.password);
if (!vaild) return res.send(`invail password`);
 
req.session.user={
    id:user.id,
    email:user.email,
    role:user.role,
};

res.redirect('/orders');

};

exports.logout =(req,res)=>{
    req.session.destroy();
    res.redirect('/auth/login');

};
