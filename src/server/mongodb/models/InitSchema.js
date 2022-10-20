import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: String,
  phoneNumber: String,
  access: {
    type: Number,
    default: 0,
    enum: [0, 1, 2],
    required: true,
  },
  tenures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenure",
    },
  ],
});

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
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  project: {
    type: String,
    required: true,
  },
  preferences: [
    {
      type: String,
      enum: ["Front-end", "Full-stack", "Back-end"],
    },
  ],
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
    required: true,
  },
  notes: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Tenure = mongoose.models.Tenure || mongoose.model("Tenure", tenureSchema);

export {User, Tenure};
