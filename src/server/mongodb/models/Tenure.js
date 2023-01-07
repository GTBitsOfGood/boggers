import mongoose from "mongoose";
import fields from "../../../server/utils/fields";

const tenureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  semester: {
    type: String,
    enum: fields.semesters,
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    enum: fields.departments,
  },
  role: {
    type: String,
    enum: fields.roles,
  },
  project: {
    type: String,
    enum: fields.projects,
  },
  status: {
    type: String,
    enum: fields.statuses,
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
