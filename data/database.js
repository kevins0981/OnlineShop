const mongodb = require("mongodb");

const mongoClient = mongodb.MongoClient;

let mongodbUrl = 'mongodb://localhost:27017';

if (process.env.MONGODB_URL){
    mongodbUrl = process.env.MONGODB_URL;
}

let database;

async function connectToDatabase(){
    const client = await mongoClient.connect(mongodbUrl);
    database = client.db('online-shop');
}

function getDb() {
    if(!database){
        throw new Error("You must connect to database!");
    }

    return database;
}

module.exports = {
    connectToDatabase: connectToDatabase,
    getDb: getDb
}
