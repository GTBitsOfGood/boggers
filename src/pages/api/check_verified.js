import { getUserVerificationStatus } from "../../server/mongodb/actions/User";
import { emailVerification } from "../../server/utils/emailFunctions";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const { email } = req.body;
  const user = await getUserVerificationStatus(email);
  // If user does not exist, let next auth handle it
  const isUnauthNewUser = user && !user.emailVerified;
  if (isUnauthNewUser) {
    emailVerification(email);
  }
  res.status(200).send({ success: user && user.emailVerified, isUnauthNewUser });
}

export default requestWrapper(handler, "POST");
