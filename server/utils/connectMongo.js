const mongoose = require("mongoose");

const connectMongo = async () => {
  const len = mongoose.connections.length - 1
  if (mongoose.connections[len].readyState === 1 || mongoose.connection[len].readyState === 2) return;

  await mongoose
    .connect(process.env.DB_URL)
    .catch((error) => {
      console.log(`Error connecting to MongoDB: ${error}`);
      throw error;
    });
}

module.exports = connectMongo;