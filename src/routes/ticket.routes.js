const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticket.controller');
const { isAuthenticated } = require('../middlewares/auth.middleware');
const { isAdmin } = require('../middlewares/role.middleware');

// All ticket routes require authentication
router.use(isAuthenticated);

// Admin routes - list all tickets
router.get('/', isAdmin, ticketController.getAll);
router.post('/:id/status', isAdmin, ticketController.updateStatus);

// Client routes - more specific routes must come before generic ones
router.get('/my-tickets', ticketController.getMyTickets);
router.post('/', ticketController.create);
router.get('/:id', ticketController.getDetail);
router.post('/:id/comment', ticketController.addComment);

module.exports = router;
