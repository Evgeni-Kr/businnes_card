const db = require('../database');
const Order = require('../entities/Order');
const sendMail = require('../../utils/mailer');
const { requireRole } = require('../../utils/auth');

async function createOrder(req, res, user) {
    requireRole(user, 'ROLE_USER');

    const order = new Order(
        null,
        user.getId(),
        req.body.service,
        req.body.message
    );

    const saved = await db.createOrder(order);
    res.end(JSON.stringify(saved));
}

async function getAllOrders(req, res, user) {
    requireRole(user, 'ROLE_ADMIN');

    const orders = await db.getAllOrders();
    res.end(JSON.stringify(orders));
}

async function answerOrder(req, res, user) {
    requireRole(user, 'ROLE_ADMIN');

    await db.answerOrder(req.body.orderId, req.body.response);

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
