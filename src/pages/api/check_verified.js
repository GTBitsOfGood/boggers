import { createEmailVerification } from "../../server/mongodb/actions/EmailVerification";
import { getUserVerificationStatus } from "../../server/mongodb/actions/User";
import sendEmailVerificationEmail from "../../server/nodemailer/actions/emailVerification";
import connectMailer from "../../server/nodemailer/connectMailer";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const { email } = req.body;
  const user = await getUserVerificationStatus(email);
  // If user does not exist, let next auth handle it
  if (!user || user.emailVerified) {
    return res.status(200).json({ success: true });
  } else {
    createEmailVerification(email)
      .then(
        (accountRecovery) =>
          new Promise((resolve, reject) => {
            connectMailer()
              .then((transporter) => resolve({ accountRecovery, transporter }))
              .catch((err) => reject(err));
          }),
      )
      .then(({ accountRecovery, transporter }) => sendEmailVerificationEmail(transporter, accountRecovery.email, accountRecovery.token))
      .catch((err) => {
        console.log(err);
      });
    res.status(200).send({ success: false });
  }
}

export default requestWrapper(handler, "POST");
