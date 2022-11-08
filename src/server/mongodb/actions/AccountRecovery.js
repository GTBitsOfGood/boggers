import AccountRecovery from "../models/AccountRecovery.js";

async function createAccountRecovery(email) {
  const accountRecovery = await AccountRecovery.findOneAndUpdate({email}, {email}, {upsert: true, new: true});
  return accountRecovery;
}

async function getAccountRecovery(token) {
  return AccountRecovery.findOne({where: {token}});
}

export {createAccountRecovery, getAccountRecovery};
