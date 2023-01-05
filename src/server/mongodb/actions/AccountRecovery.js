import AccountRecovery from "../models/AccountRecovery.js";

async function createAccountRecovery(email) {
  return AccountRecovery.findOneAndUpdate({ email }, { email }, { upsert: true, new: true });
}

async function checkAccountRecovery(token) {
  return !!AccountRecovery.findOne({ token });
}

async function getAndDeleteAccountRecovery(token) {
  return AccountRecovery.findOneAndDelete({ token });
}

export { createAccountRecovery, checkAccountRecovery, getAndDeleteAccountRecovery };
