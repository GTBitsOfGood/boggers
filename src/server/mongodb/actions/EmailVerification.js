import EmailVerification from "../models/EmailVerification";

async function createEmailVerification(email, newEmail) {
  return EmailVerification.findOneAndUpdate({ email }, { email, newEmail }, { upsert: true, new: true });
}

async function getAndDeleteEmailVerification(token) {
  return EmailVerification.findOneAndDelete({ token });
}

async function deleteEmail(email) {
  return EmailVerification.deleteMany({ email });
}

async function deleteNewEmail(newEmail) {
  return EmailVerification.deleteMany({ newEmail });
}

export { createEmailVerification, getAndDeleteEmailVerification, deleteEmail, deleteNewEmail };
