import mongoose from "mongoose";
import connectMongo from '../connectMongo';

//Please copy and past following three line of code if you want to make a new server-side action or models
//If statement used to further increase the performance.
if (!global.mongoose || !global.mongoose.db) {
  await connectMongo();
}

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);

export default Test;
