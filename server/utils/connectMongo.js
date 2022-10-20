import mongoose from "mongoose";

async function connectMongo() {
  const len = mongoose.connections.length - 1;
  if (mongoose.connections[len].readyState === 1 || mongoose.connections[len].readyState === 2) return;
  await mongoose.connect(process.env.DB_URL).catch((error) => {
    console.log(`Error connecting to MongoDB: ${error}`);
    throw error;
  });
}

export default connectMongo;
