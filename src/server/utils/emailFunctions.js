import { changeEmail, setVerified } from "../../server/mongodb/actions/User";
import { createEmailVerification, getAndDeleteEmailVerification, deleteNewEmailVerification } from "../mongodb/actions/EmailVerification";
import { createAccountRecovery } from "../mongodb/actions/AccountRecovery";
import sendEmailVerificationEmail from "../nodemailer/actions/emailVerification";
import sendAccountRecoveryEmail from "../nodemailer/actions/accountRecovery";
import connectMailer from "../nodemailer/connectMailer";

const sendEmailVerification = async (originalEmail, email = null) => {
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
    .then(({ emailVerification, transporter }) => {
      new Promise((resolve, reject) => {
        sendEmailVerificationEmail(transporter, email, emailVerification.token)
          .then(() => {
            console.log("Email sent");
            resolve();
          })
          .catch((err) => {
            console.log("Email not sent", err);
            reject();
          });
      });
    })
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
    .then(({ accountRecovery, transporter }) => {
      new Promise((resolve, reject) => {
        sendAccountRecoveryEmail(transporter, accountRecovery.email, accountRecovery.token)
          .then(() => resolve())
          .catch(() => reject());
      });
    })
    .catch((err) => console.log(err));
};

const emailVerification = async (token) => {
  const emailVerification = await getAndDeleteEmailVerification(token);
  if (!emailVerification) {
    return { success: false };
  }
  deleteNewEmailVerification(emailVerification.newEmail);

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
