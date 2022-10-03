import mongoose from "mongoose";
import connectMongo from '../connectMongo';

if (!global.mongoose || !global.mongoose.db) {
  console.log(global.mongoose)
  await connectMongo();
  console.log(global.mongoose);
}

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);

export default Test;
