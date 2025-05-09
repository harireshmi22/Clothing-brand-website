const { MongoClient } = require('mongodb');
const products = require('./products.js'); // yeh path wahi hona chahiye jahan aapka products.js hai

const uri = 'mongodb://localhost:27017'; // apne MongoDB ka URI yahan daalein
const dbName = 'Fashion_Mart';       // apne database ka naam yahan daalein
const collectionName = 'products';       // jis collection mein insert karna hai

async function run() {
    const client = new MongoClient(uri, { useUnifiedTopology: true });
    try {
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        // Optional: Purane products hataane ke liye
        // await collection.deleteMany({});

        // Insert products
        const result = await collection.insertMany(products);
        console.log(`${result.insertedCount} products inserted!`);
    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
}

run();