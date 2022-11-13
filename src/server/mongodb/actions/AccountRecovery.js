import connectMongo from "../connectMongo.js";
import AccountRecovery from "../models/AccountRecovery.js";

async function createAccountRecovery(email) {
  await connectMongo();
  return await AccountRecovery.findOneAndUpdate({email}, {email}, {upsert: true, new: true});
}

async function getAccountRecovery(token) {
  await connectMongo();
  return AccountRecovery.findOne({where: {token}});
}

export {createAccountRecovery, getAccountRecovery};
