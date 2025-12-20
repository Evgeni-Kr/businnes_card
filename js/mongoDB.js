const { MongoClient } = require('mongodb');

const URL = 'mongodb://127.0.0.1:27017';
const DB_NAME = 'business_cart';

let db;

async function connect() {

    if (db) { 
        console.log('MongoDB neconnected'); return db; 
    }

    const client = new MongoClient(URL);
    await client.connect();

    db = client.db(DB_NAME);
    console.log('MongoDB connected');

    return db;
}

module.exports = { connect };
