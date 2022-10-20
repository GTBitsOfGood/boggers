import mongoose from "mongoose";
import urls from "../../../utils/urls";
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = {db: null, promise: null};
}

async function connectMongo() {
  if (cached.db) {
    return cached.db;
  }

  if (!cached.promise) {
    const opts = {
      dbName: urls.dbName,
    };

    cached.promise = mongoose.connect(urls.dbUrl, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.db = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.db;
}

export default connectMongo;
