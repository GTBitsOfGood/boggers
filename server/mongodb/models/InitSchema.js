import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: true,
  },
  preferences: {
    type: String,
    required: true,
  },
  admin: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  semesterCreated: {
    type: String,
    enum: ["spring", "summer", "fall"],
    required: true,
  },
  yearCreated: {
    type: Number,
    required: true,
  },
});

const tenureSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  semester: {
    type: String,
    enum: ["spring", "summer", "fall"],
    required: true,
  },
  year: {
    type: Number,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);
const Tenure = mongoose.models.Tenure || mongoose.model("Tenure", tenureSchema);

export {User, Project, Tenure};
