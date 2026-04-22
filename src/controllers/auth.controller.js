const bcrypt = require('bcrypt');
const userModel = require('../models/user.model');

exports.register =async (req,res) =>{
    const {name,email,password,confirmPassword,role} =req.body; 

    // Validate password match
    if(password !== confirmPassword) {
        return res.status(400).send('Passwords do not match. Please try again.');
    }

    // Validate password length
    if(password.length < 6) {
        return res.status(400).send('Password must be at least 6 characters long.');
    }

    // Check if email already exists
    try {
        const existingUser = await userModel.findByEmail(email);
        if(existingUser.rows.length > 0) {
            return res.status(400).send('Email is already registered. Please use a different email or login.');
        }
    } catch(err) {
        console.error('Error checking email:', err);
        return res.status(500).send('An error occurred. Please try again.');
    }

    try {
        const hashed =await bcrypt.hash(password,10);
        await userModel.createUser(name,email,hashed,role);

        // Redirect back to dashboard with success message
        res.redirect('/orders#register?success=User registered successfully!');
    } catch(err) {
        console.error('Error registering user:', err);
        res.status(500).send('Error registering user. Please try again.');
    }
      
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
    
    // Prevent caching after logout
    res.set('Cache-Control', 'no-cache, no-store, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    
    res.redirect('/auth/login');

};
