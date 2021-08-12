async function exec() {
    const { MongoClient } = require('mongodb');
    const { MONGO_DB_URL, DB_NAME } = require('./src/configs');

    connection = await MongoClient.connect(MONGO_DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    db = connection.db(DB_NAME);

    // await db.users.insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' });
    await db.collection('users').insertOne({ name: 'admin', email: 'root@email.com', password: 'admin', role: 'admin' });
}

exec();