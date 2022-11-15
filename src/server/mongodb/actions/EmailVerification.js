import connectMongo from "../connectMongo.js";
import EmailVerification from "../models/EmailVerification";

async function createEmailVerification(email) {
  await connectMongo();
  return EmailVerification.findOneAndUpdate({email}, {email, newEmail: null}, {upsert: true, new: true});
}

async function createEmailChangeVerification(email, newEmail) {
  await connectMongo();
  return EmailVerification.findOneAndUpdate({email}, {email, newEmail}, {upsert: true, new: true});
}

async function getEmailVerification(token) {
  await connectMongo();
  return EmailVerification.findOne({token});
}

export {createEmailVerification, createEmailChangeVerification, getEmailVerification};
