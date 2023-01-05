import { createEmailVerification } from "../../server/mongodb/actions/EmailVerification";
import { getUser } from "../../server/mongodb/actions/User";
import sendEmailVerificationEmail from "../../server/nodemailer/actions/emailVerification";
import connectMailer from "../../server/nodemailer/connectMailer";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const { email } = req.body;
  const user = await getUser(email);
  // If user does not exist, let next auth handle it
  if (!user || user.emailVerified) {
    res.status(200).json({ success: true });
  } else {
    const accountRecovery = await createEmailVerification(email);
    const transporter = await connectMailer();
    sendEmailVerificationEmail(transporter, accountRecovery.email, accountRecovery.token);
    res.status(200).send({ success: false });
  }
}

export default requestWrapper(handler, "POST");
