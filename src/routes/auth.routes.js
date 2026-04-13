const express = require('express');

const router = express.Router();

const controller =require('../controllers/auth.controller');

router.get('/login',(req,res)=> res.render('auth/login'));
router.get('/register',(req,res)=> res.render('auth/register'));

router.post('/login',controller.login);
router.post('/register',controller.register);

router.get('/logout',controller.logout);

module.exports = router;