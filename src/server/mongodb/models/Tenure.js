import mongoose from "mongoose";

const tenureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  semester: {
    type: String,
    enum: ["Spring", "Summer", "Fall"],
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
  },
  role: {
    type: String,
  },
  project: {
    type: String,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  notes: String,
});

tenureSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
    }
    delete returnedObject.__v;
  },
});

const Tenure = mongoose.models.Tenure || mongoose.model("Tenure", tenureSchema);
export default Tenure;
