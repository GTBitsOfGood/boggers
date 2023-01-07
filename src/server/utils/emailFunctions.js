import { changeEmail, setVerified } from "../../server/mongodb/actions/User";
import { createEmailVerification, getAndDeleteEmailVerification, deleteNewEmail } from "../mongodb/actions/EmailVerification";
import { createAccountRecovery } from "../mongodb/actions/AccountRecovery";
import sendEmailVerificationEmail from "../nodemailer/actions/emailVerification";
import sendAccountRecoveryEmail from "../nodemailer/actions/accountRecovery";
import connectMailer from "../nodemailer/connectMailer";

const sendEmailVerification = (originalEmail, email = null) => {
  email = email || originalEmail;
  createEmailVerification(originalEmail, email)
    .then(
      (emailVerification) =>
        new Promise((resolve, reject) => {
          connectMailer()
            .then((transporter) => resolve({ emailVerification, transporter }))
            .catch((err) => reject(err));
        }),
    )
    .then(({ emailVerification, transporter }) => sendEmailVerificationEmail(transporter, email, emailVerification.token))
    .catch((err) => {
      console.log(err);
    });
};

const sendAccountRecovery = (email) => {
  createAccountRecovery(email)
    .then(
      (accountRecovery) =>
        new Promise((resolve, reject) => {
          connectMailer()
            .then((transporter) => resolve({ accountRecovery, transporter }))
            .catch((err) => reject(err));
        }),
    )
    .then(({ accountRecovery, transporter }) => sendAccountRecoveryEmail(transporter, accountRecovery.email, accountRecovery.token))
    .catch((err) => console.log(err));
};

const emailVerification = async (token) => {
  const emailVerification = await getAndDeleteEmailVerification(token);
  if (!emailVerification) {
    return { success: false };
  }
  deleteNewEmail(emailVerification.newEmail);

  const isNewUser = emailVerification.email === emailVerification.newEmail;
  if (isNewUser) {
    await setVerified(emailVerification.email);
    sendAccountRecovery(emailVerification.email);
  } else {
    await changeEmail(emailVerification.email, emailVerification.newEmail);
  }
  return { success: true, isNewUser };
};

export { sendEmailVerification, sendAccountRecovery, emailVerification };
