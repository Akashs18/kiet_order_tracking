const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplier.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// All supplier routes require authentication and admin role
router.use(isAuthenticated);
router.use(isAdmin);

router.get('/', supplierController.getAll);
router.post('/', supplierController.create);
router.post('/:id/delete', supplierController.delete);
router.post('/:id/update', supplierController.update);

module.exports = router;
