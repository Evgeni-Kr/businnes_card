const { MongoClient } = require('mongodb');

class MongoDB {
    constructor() {
        this.url = 'mongodb://127.0.0.1:27017';
        this.dbName = 'business_cart';
        this.client = new MongoClient(this.url);
        this.db = null;
    }

    async connect() {
        if (!this.db) {
            await this.client.connect();
            this.db = this.client.db(this.dbName);
            console.log('MongoDB connected');
        }
        return this.db;
    }

    async orders() {
        const db = await this.connect();
        return db.collection('orders');
    }
}

module.exports = new MongoDB();
