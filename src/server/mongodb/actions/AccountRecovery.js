import AccountRecovery from "../models/AccountRecovery.js";

async function createAccountRecovery(email) {
  return await AccountRecovery.findOneAndUpdate({ email }, { email }, { upsert: true, new: true });
}

async function getAndDeleteAccountRecovery(token) {
  return AccountRecovery.findOneAndDelete({ token });
}

export { createAccountRecovery, getAndDeleteAccountRecovery };
