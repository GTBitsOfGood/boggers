import { createEmailVerification } from "../mongodb/actions/EmailVerification";
import { createAccountRecovery } from "../mongodb/actions/AccountRecovery";
import sendEmailVerificationEmail from "../nodemailer/actions/emailVerification";
import sendAccountRecoveryEmail from "../nodemailer/actions/accountRecovery";
import connectMailer from "../nodemailer/connectMailer";

const emailVerification = (originalEmail, email = null) => {
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

const accountRecovery = (email) => {
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

export { emailVerification, accountRecovery };
