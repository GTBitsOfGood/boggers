import { changeEmail, setVerified } from "../../server/mongodb/actions/User";
import { getAndDeleteEmailVerification } from "../../server/mongodb/actions/EmailVerification";
import { accountRecovery } from "../../server/utils/emailFunctions";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const { token } = req.body;
  const emailVerification = await getAndDeleteEmailVerification(token);

  if (!emailVerification) {
    return res.status(200).json({ success: false });
  }

  const isNewUser = emailVerification.email === emailVerification.newEmail;
  if (isNewUser) {
    await setVerified(emailVerification.email);
    accountRecovery(emailVerification.email);
  } else {
    await changeEmail(emailVerification.email, emailVerification.newEmail);
  }
  res.status(200).json({ success: true, isNewUser });
}

export default requestWrapper(handler, "POST");
