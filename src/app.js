const express =required('express');
const path = required ('path');

const sessionConfig = session('./config/session');

const app =express();

//middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(sessionConfig);

//static
app.use(express.static(path.join(__dirname,'public')));

//view engine
app.set('view engine','ejs');
app.set('view',path.join(__dirname,'views'));

//routes
app.use('/auth',require('./routes/auth.routes.js'));
app.use('/order',require('./routes/order.routes.js/index.js'));

app.use('/',(req,res)=>{
res.redirect('orders');
});

module.exports =app;

