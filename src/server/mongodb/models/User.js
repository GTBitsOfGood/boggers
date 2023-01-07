import mongoose from "mongoose";
import fields from "../../../server/utils/fields";

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
  preference: {
    type: String,
    enum: fields.preferences,
  },
  access: {
    type: Number,
    default: 0,
    enum: Object.keys(fields.memberTypes).map((key) => parseInt(key)),
  },
  tenures: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenure",
    },
  ],
  image: {
    type: Boolean,
    default: false,
  },
  emailVerified: {
    type: Boolean,
    default: false,
  },
});

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    if (returnedObject._id) {
      returnedObject.id = returnedObject._id.toString();
      delete returnedObject._id;
    }
    if (returnedObject.password) {
      delete returnedObject.password;
    }
    if (returnedObject.fullName && returnedObject.lastName) {
      returnedObject.fullName = `${returnedObject.firstName} ${returnedObject.lastName}`;
    }
    delete returnedObject.__v;
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
