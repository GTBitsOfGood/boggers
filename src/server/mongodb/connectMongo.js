import mongoose from "mongoose"
import urls from "../../../utils/urls"

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { db: null, conn: null, promise: null }
}
//cached mongodb connection but not database, please access database with following line:
//const db = cached.conn.db(urls.dbName)
async function connectMongo () {
  if (cached.db) {
    return cached.db
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(urls.dbUrl).then(mongoose => {
      return mongoose
    })
  }
  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  cached.db = cached.conn.db(urls.dbName)
  return cached.db
}

export default connectMongo
