import EmailVerification from "../models/EmailVerification";

async function createEmailVerification(email, newEmail) {
  return EmailVerification.findOneAndUpdate({ email }, { email, newEmail }, { upsert: true, new: true });
}

async function getAndDeleteEmailVerification(token) {
  return EmailVerification.findOneAndDelete({ token });
}

export { createEmailVerification, getAndDeleteEmailVerification };
