const { parseBody } = require('./utils/bodyParser');
const orderService = require('./services/orderService');
const { getUserFromRequest } = require('./utils/auth');
const fs = require('node:fs');
const path = require('node:path');

module.exports = async function router(req, res) {
    // 🔐 авторизация
    const user = await getUserFromRequest(req);

    // ===== API =====

    if (req.method === 'POST' && req.url === '/api/orders') {
        const body = await parseBody(req);
        const order = await orderService.createOrder(user, body);

        res.writeHead(201, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(order));
    }

    if (req.method === 'GET' && req.url === '/api/admin/orders') {
        const orders = await orderService.getAllOrders(user);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify(orders));
    }

    if (req.method === 'POST' && req.url.startsWith('/api/admin/orders/answer')) {
        const body = await parseBody(req);
        await orderService.answerOrder(user, body.orderId, body.response);

        res.writeHead(200);
        return res.end();
    }

    // ===== ADMIN PAGE =====

    if (req.method === 'GET' && req.url === '/admin') {
        const file = fs.readFileSync(
            path.join(__dirname, 'public/admin.html')
        );
        res.writeHead(200, { 'Content-Type': 'text/html' });
        return res.end(file);
    }

    res.writeHead(404);
    res.end();
};
