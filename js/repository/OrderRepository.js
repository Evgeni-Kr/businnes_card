const mongo = require('./mongo');
const { ObjectId } = require('mongodb');

class OrderRepository {

    async create(order) {
        const collection = await mongo.orders();

        const result = await collection.insertOne({
            userId: order.userId,
            service: order.service,
            message: order.message,
            status: order.status,
            adminResponse: null,
            createdAt: new Date(),
            answeredAt: null
        });

        return { ...order, _id: result.insertedId };
    }

    async findAll() {
        const collection = await mongo.orders();
        return collection.find().sort({ createdAt: -1 }).toArray();
    }

    async answer(orderId, response) {
        const collection = await mongo.orders();

        await collection.updateOne(
            { _id: new ObjectId(orderId) },
            {
                $set: {
                    status: 'ANSWERED',
                    adminResponse: response,
                    answeredAt: new Date()
                }
            }
        );
    }
}

module.exports = new OrderRepository();
