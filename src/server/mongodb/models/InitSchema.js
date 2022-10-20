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
  preference: String,
  admin: {
    type: Boolean,
    default: false,
    required: true,
  },
  role: {
    type: String,
    enum: ["Developer", "Alumni", "Senior Dev", "Dev Bootcamper"],
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
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
  project: {
    type: String,
    required: true,
  },
  notes: {
    type: String,
    required: true,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Tenure = mongoose.models.Tenure || mongoose.model("Tenure", tenureSchema);

export {User, Tenure};
