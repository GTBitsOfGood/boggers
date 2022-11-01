import connectMongo from "../connectMongo.js";
import AccountRecovery from "../models/AccountRecovery.js";

async function createAccountRecovery(email) {
  await connectMongo();
  const accountRecovery = await AccountRecovery.findOneAndUpdate({email}, {upsert: true, new: true});
  return accountRecovery;
}

async function getAccountRecovery(token) {
  await connectMongo();
  return AccountRecovery.findOne({where: {token}});
}

export {createAccountRecovery, getAccountRecovery};
