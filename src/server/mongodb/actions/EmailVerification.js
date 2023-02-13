import EmailVerification from "../models/EmailVerification";

async function createEmailVerification(email, newEmail) {
  return EmailVerification.findOneAndUpdate({ email }, { email, newEmail }, { upsert: true, new: true });
}

async function getAndDeleteEmailVerification(token) {
  return EmailVerification.findOneAndDelete({ token });
}

async function deleteEmailVerification(email) {
  return EmailVerification.deleteMany({ email });
}

async function deleteNewEmailVerification(newEmail) {
  return EmailVerification.deleteMany({ newEmail });
}

export { createEmailVerification, getAndDeleteEmailVerification, deleteEmailVerification, deleteNewEmailVerification };
