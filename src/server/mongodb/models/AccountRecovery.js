import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const accountRecoverySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    default: uuidv4,
  },
});

const AccountRecovery = mongoose.models.AccountRecovery || mongoose.model("AccountRecovery", accountRecoverySchema);
export default AccountRecovery;
