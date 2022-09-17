import { Schema, models, model } from "mongoose";

const testSchema = new Schema({
  name: {
    type: String,
    required: true,
  }
});

const Test = models.Test || model("Test", testSchema);

export default Test;