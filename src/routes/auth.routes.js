const express = require('express');

const router = express.Router();

const controller = require('../controllers/auth.controller');
const { isAdmin } = require('../middlewares/role.middleware');

router.get('/login', (req, res) => res.render('auth/login'));
router.get('/register', isAdmin, (req, res) => res.render('auth/register'));

router.post('/login', controller.login);
router.post('/register', isAdmin, controller.register);

router.get('/logout', controller.logout);
router.get('/user-by-email/:email', controller.searchUserByEmail);

module.exports = router;