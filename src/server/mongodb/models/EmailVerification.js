import mongoose from "mongoose";
import {v4 as uuidv4} from "uuid";

const emailVerificationSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  newEmail: {
    type: String,
    default: null,
  },
  token: {
    type: String,
    required: true,
    default: uuidv4,
  },
});

const EmailVerification = mongoose.models.EmailVerification || mongoose.model("EmailVerification", emailVerificationSchema);
export default EmailVerification;
