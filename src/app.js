const express =require('express');
const path = require('path');
const bcrypt=require('bcrypt');

const sessionConfig = require('./config/session');

 const app =express();
// async function hashpassword (){
// const hash = await bcrypt.hash("123456", 10);
// console.log(hash);
// }
// hashpassword();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(sessionConfig);

//static
app.use(express.static(path.join(__dirname,'public')));

//view engine
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//routes
app.use('/auth',require('./routes/auth.routes.js'));
app.use('/orders', require('./routes/order.routes.js'));
app.use('/suppliers', require('./routes/supplier.routes.js'));
app.use('/tickets', require('./routes/ticket.routes.js'));

app.get('/', (req, res) => {
  res.redirect('/auth/login');
});
module.exports =app;

