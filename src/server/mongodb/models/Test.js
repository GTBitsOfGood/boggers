import mongoose from "mongoose";
import connectMongo from '../connectMongo';

const testSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Test = mongoose.models.Test || mongoose.model("Test", testSchema);
export default Test;
