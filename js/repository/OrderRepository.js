const { ObjectId } = require('mongodb');
const Order = require('../entities/Order');
const { connect } = require('../mongoDB');

class OrderRepository {

    async create(order) {
        const db = await connect();

        const result = await db.collection('orders').insertOne({
            userId: order.userId,
            service: order.service,
            message: order.message,
            status: order.status,
            adminResponse: order.adminResponse,
            createdAt: order.createdAt,
            answeredAt: order.answeredAt
        });

        return new Order({
            _id: result.insertedId,
            ...order
        });
    }

    async findAll() {
        const db = await connect();

        const docs = await db
            .collection('orders')
            .find()
            .sort({ createdAt: -1 })
            .toArray();

        return docs.map(d => new Order(d));
    }

    async answer(orderId, response) {
        const db = await connect();

        await db.collection('orders').updateOne(
            { _id: new ObjectId(orderId) },
            {
                $set: {
                    adminResponse: response,
                    status: 'ANSWERED',
                    answeredAt: new Date()
                }
            }
        );
    }
}

module.exports = new OrderRepository();
