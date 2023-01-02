import { createEmailVerification } from "../../server/mongodb/actions/EmailVerification";
import { getUser } from "../../server/mongodb/actions/User";
import sendEmailVerificationEmail from "../../server/nodemailer/actions/emailVerification";
import connectMailer from "../../server/nodemailer/connectMailer";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  if (req.method === "POST") {
    const user = await getUser(req.body.email);
    // If user does not exist, let next auth handle it
    if (!user || user.emailVerified) {
      res.status(200).send();
    } else {
      const accountRecovery = await createEmailVerification(req.body.email);
      const transporter = await connectMailer();
      await sendEmailVerificationEmail(transporter, accountRecovery.email, accountRecovery.token);
      res.status(401).send();
    }
  } else {
    res.status(404).json({
      success: false,
      message: "unknown endpoint",
    });
  }
}

export default requestWrapper(handler, "POST");
