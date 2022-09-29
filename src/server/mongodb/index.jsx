import mongoose from "mongoose"
import urls from "../../utils/urls"
let cachedClient = null;
let cachedDB = null;
async function connectMongo() {
  const len = mongoose.connections.length - 1
  if (cachedClient && cachedDB) 
  return {
    client: cachedClient,
    db: cachedDB,
  };

  let client = new MongoClient(urls.dbUrl);
  await client.connect();
  let db = client.db(process.env.DB_NAME);
  cachedClient = client;
  cachedDB = db;
  return {
    client: cachedClient,
    db: cachedDB,
  }
  // await mongoose
  //   .connect(process.env.DB_URL)
  //   .catch((error) => {
  //     console.log(`Error connecting to MongoDB: ${error}`);
  //     throw error;
  //   });
}

export default connectMongo;