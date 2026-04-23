const router = require('express').Router();

const controller = require('../controllers/order.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');

// Admin-only guard middleware
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'ADMIN') return next();
    return res.status(403).send('Access denied');
};

router.get('/', isAuthenticated, controller.getOrders);
router.get('/:id', isAuthenticated, controller.getOrderById);
router.post('/', isAuthenticated, controller.createOrder);
router.post('/:id/status', isAuthenticated, controller.updatestatus);

// File upload (admin only)
router.post('/:id/files', isAuthenticated, isAdmin, upload.single('orderFile'), controller.uploadFile);

// File delete (admin only)
router.post('/:id/files/:fileId/delete', isAuthenticated, isAdmin, controller.deleteFile);

module.exports = router;