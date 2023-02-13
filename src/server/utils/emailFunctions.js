import { changeEmail, setVerified } from "../../server/mongodb/actions/User";
import { createEmailVerification, getAndDeleteEmailVerification, deleteNewEmailVerification } from "../mongodb/actions/EmailVerification";
import { createAccountRecovery } from "../mongodb/actions/AccountRecovery";
import sendEmailVerificationEmail from "../nodemailer/actions/emailVerification";
import sendAccountRecoveryEmail from "../nodemailer/actions/accountRecovery";
import connectMailer from "../nodemailer/connectMailer";

const sendEmailVerification = async (originalEmail, email = null) => {
  email = email || originalEmail;
  try {
    console.log("starting email verification");
    const emailVerification = await createEmailVerification(originalEmail, email);
    console.log("email verification created");
    const transporter = await connectMailer();
    console.log("transporter connected");
    const emailSent = await sendEmailVerificationEmail(transporter, email, emailVerification.token);
    console.log("email sent", emailSent);
  } catch (err) {
    console.log("error", err);
  }
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
