import mongoose from "mongoose";
import urls from "../../../utils/urls";

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { db: null, promise: null };
}
export default async function connectMongo() {
  if (cached.db) {
    return cached.db;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(urls.dbUrl, { dbName: urls.dbName }).then((mongoose) => {
      return mongoose;
    });
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  cached.db = cached.conn.db(urls.dbName);
  return cached.db;
}
