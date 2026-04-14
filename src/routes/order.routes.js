const router = require('express').Router();

const controller = require('../controllers/order.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');

router.get('/', isAuthenticated, controller.getOrders);
router.get('/:id', isAuthenticated, controller.getOrderById);
router.post('/', isAuthenticated, controller.createOrder);
router.post('/:id/status', isAuthenticated, controller.updatestatus);

module.exports = router;