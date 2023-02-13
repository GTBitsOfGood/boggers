import { getUserVerificationStatus } from "../../server/mongodb/actions/User";
import { sendEmailVerification } from "../../server/utils/emailFunctions";
import requestWrapper from "../../server/utils/middleware";

async function handler(req, res) {
  let { email } = req.body;
  email = email?.toLowerCase();
  const user = await getUserVerificationStatus(email);
  // If user does not exist, let next auth handle it
  const isUnauthNewUser = user && !user.emailVerified;
  if (isUnauthNewUser) {
    console.log("started");
    await sendEmailVerification(email);
    console.log("done");
  }
  res.status(200).send({ success: user && user.emailVerified, isUnauthNewUser });
}

export default requestWrapper(handler, "POST");
