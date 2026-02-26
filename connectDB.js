const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected");
    return client.db();
  } catch (err) {
    console.error("❌ MongoDB connection failed", err);
    process.exit(1);
  }
}

module.exports = connectDB;