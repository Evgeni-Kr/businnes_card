const Order = require('../entities/Order');
const orderRepo = require('../repository/OrderRepository');
const { requireRole } = require('../../utils/auth');

async function createOrder(req, res, user) {
    // requireRole(user, 'ROLE_USER');

    const order = new Order({
        userId: user ? user.getId() : null,
        service: req.body.service,
        message: req.body.message
    });

    const errors = order.validate();
    if (errors.length) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ errors }));
    }

    const savedOrder = await orderRepo.create(order);

    res.writeHead(201, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(savedOrder));
}

async function getAllOrders(req, res, user) {
    requireRole(user, 'ROLE_ADMIN');

    const orders = await orderRepo.findAll();

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(orders));
}

async function answerOrder(req, res, user) {
    requireRole(user, 'ROLE_ADMIN');

    const { orderId, response } = req.body;

    await orderRepo.answer(orderId, response);

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true }));
}

module.exports = {
    createOrder,
    getAllOrders,
    answerOrder
};
