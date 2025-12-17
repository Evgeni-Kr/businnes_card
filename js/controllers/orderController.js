const Order = require('../entities/Order');
const orderRepo = require('../database/orderRepository');
const sendMail = require('../../utils/mailer');
const { requireRole } = require('../../utils/auth');

async function createOrder(req, res, user) {
    requireRole(user, 'ROLE_USER');

    const order = new Order({
        userId: user.getId(),
        service: req.body.service,
        message: req.body.message
    });

    const errors = order.validate();
    if (errors.length) {
        res.writeHead(400);
        return res.end(JSON.stringify({ errors }));
    }

    const saved = await orderRepo.create(order);
    res.end(JSON.stringify(saved));
}

async function getAllOrders(req, res, user) {
    requireRole(user, 'ROLE_ADMIN');

    const orders = await orderRepo.findAll();
    res.end(JSON.stringify(orders));
}

async function answerOrder(req, res, user) {
    requireRole(user, 'ROLE_ADMIN');

    await orderRepo.answer(req.body.orderId, req.body.response);

    const orderUser = await db.findUserById(req.body.userId);

    await sendMail(
        orderUser.getEmail(),
        'Ответ по вашему заказу',
        req.body.response
    );

    res.end(JSON.stringify({ success: true }));
}

module.exports = {
    createOrder,
    getAllOrders,
    answerOrder
};
