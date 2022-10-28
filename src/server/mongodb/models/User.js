import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
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

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    returnedObject.fullName = `${returnedObject.firstName} ${returnedObject.lastName}`;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.password;
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
