const ticketModel = require('../models/ticket.model');

exports.create = async (req, res) => {
    try {
        // Only clients can create tickets, not admins
        if (req.session.user.role === 'ADMIN') {
            return res.status(403).send('Admins cannot create tickets');
        }
        const { title, description, priority } = req.body;
        if (!title || !description) {
            return res.status(400).send('Title and description are required');
        }
        await ticketModel.create(req.session.user.id, title, description, priority || 'MEDIUM');
        res.redirect('/orders#tickets');
    } catch (error) {
        console.error('Error creating ticket:', error);
        res.status(500).send('Error creating ticket');
    }
};

exports.getAll = async (req, res) => {
    try {
        const result = await ticketModel.getAll();
        res.render('tickets/list', { tickets: result.rows, user: req.session.user });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).send('Error fetching tickets');
    }
};

exports.getMyTickets = async (req, res) => {
    try {
        const result = await ticketModel.getByUserId(req.session.user.id);
        res.render('tickets/my-tickets', { tickets: result.rows, user: req.session.user });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        res.status(500).send('Error fetching tickets');
    }
};

exports.getDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const ticketResult = await ticketModel.getById(id);
        const commentsResult = await ticketModel.getComments(id);
        
        if (!ticketResult.rows[0]) {
            return res.status(404).send('Ticket not found');
        }

        const ticket = ticketResult.rows[0];
        
        // Check authorization
        if (req.session.user.role !== 'ADMIN' && ticket.user_id !== req.session.user.id) {
            return res.status(403).send('Access denied');
        }

        res.render('tickets/detail', { ticket, comments: commentsResult.rows, user: req.session.user });
    } catch (error) {
        console.error('Error fetching ticket detail:', error);
        res.status(500).send('Error fetching ticket');
    }
};

exports.updateStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].includes(status)) {
            return res.status(400).send('Invalid status');
        }

        await ticketModel.updateStatus(id, status);
        res.redirect(`/tickets/${id}`);
    } catch (error) {
        console.error('Error updating ticket status:', error);
        res.status(500).send('Error updating ticket');
    }
};

exports.addComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { comment } = req.body;

        if (!comment || !comment.trim()) {
            return res.status(400).send('Comment cannot be empty');
        }

        await ticketModel.addComment(id, req.session.user.id, comment);
        res.redirect(`/tickets/${id}`);
    } catch (error) {
        console.error('Error adding comment:', error);
        res.status(500).send('Error adding comment');
    }
};
