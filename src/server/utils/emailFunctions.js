import { changeEmail, setVerified } from "../../server/mongodb/actions/User";
import { createEmailVerification, getAndDeleteEmailVerification, deleteNewEmailVerification } from "../mongodb/actions/EmailVerification";
import { createAccountRecovery } from "../mongodb/actions/AccountRecovery";
import sendEmailVerificationEmail from "../nodemailer/actions/emailVerification";
import sendAccountRecoveryEmail from "../nodemailer/actions/accountRecovery";
import connectMailer from "../nodemailer/connectMailer";

const sendEmailVerification = async (originalEmail, email = null) => {
  email = email || originalEmail;
  try {
    const emailVerification = await createEmailVerification(originalEmail, email);
    const transporter = await connectMailer();
    const emailSent = await sendEmailVerificationEmail(transporter, email, emailVerification.token);
    console.log("email sent", emailSent);
    return true;
  } catch (err) {
    console.error("error", err);
    return false;
  }
};

const sendAccountRecovery = async (email) => {
  try {
    const accountRecovery = await createAccountRecovery(email);
    const transporter = await connectMailer();
    const emailSent = await sendAccountRecoveryEmail(transporter, accountRecovery.email, accountRecovery.token);
    console.log("email sent", emailSent);
    return true;
  } catch (err) {
    console.error("error", err);
    return false;
  }
};

const emailVerification = async (token) => {
  const emailVerification = await getAndDeleteEmailVerification(token);
  if (!emailVerification) {
    return { success: false };
  }
  await deleteNewEmailVerification(emailVerification.newEmail);

  const isNewUser = emailVerification.email === emailVerification.newEmail;
  if (isNewUser) {
    await setVerified(emailVerification.email);
    const res = await sendAccountRecovery(emailVerification.email);
    if (!res) {
      return { success: false };
    }
  } else {
    await changeEmail(emailVerification.email, emailVerification.newEmail);
  }
  return { success: true, isNewUser };
};

export { sendEmailVerification, sendAccountRecovery, emailVerification };
