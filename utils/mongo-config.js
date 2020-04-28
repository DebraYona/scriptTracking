const MongoClient = require("mongodb").MongoClient;
const fs = require("fs");

let process = {
  env: {
    DB_NAME: "tracking",
    COLLECTION_NAME: "trackingUsers",

    MONGO_URI: "mongodb://localhost:27017",
  },
};

// Connection URL
let DB_NAME = process.env.DB_NAME;
let COLLECTION_NAME = process.env.COLLECTION_NAME;
let DB_USER = process.env.DB_USER;
let DB_PASSWORD = process.env.DB_PASSWORD;
let DB_MONGO_URI = process.env.MONGO_URI;

// const MONGO_URL = `mongodb+srv://${DB_USER}:${encodeURIComponent(DB_PASSWORD)}@${DB_MONGO_URI}/${DB_NAME}`;
const MONGO_URL = `${DB_MONGO_URI}/${DB_NAME}`;

let cachedDb = null;


const connectToDatabase = (uri) => {
  console.log("=> connect to database");

  if (cachedDb && cachedDb.serverConfig.isConnected()) {
    console.log("=> using cached database instance");
    return Promise.resolve(cachedDb);
  }

  console.log("=> Not have cacheddb");

  return new MongoClient.connect(uri).then((client) => {
    cachedDb = client.db(DB_NAME);
    return cachedDb;
  });
};
const updateTrackings = (db, tracking) => {
  const query = {
    "type.code": tracking.type.code,
    "module.code": tracking.module.code,
    "subModule.code": tracking.subModule.code,
    "detail.code": tracking.detail.code,
  };
  let update = { $push: tracking };
  const options ={ upsert: false ,returnNewDocument: true };

  db.collection(COLLECTION_NAME).updateOne(query, update, options);
};
const insertTracking = (db , tracking) => {
  
  db.collection(COLLECTION_NAME).insertOne(tracking);
}

const listTrackingExists = (db) =>{
  return db.collection(COLLECTION_NAME).find({}).toArray();

}


module.exports = {
  connectToDatabase,
  updateTrackings,
  insertTracking,
  listTrackingExists,
  MONGO_URL,
};
