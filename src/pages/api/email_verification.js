import { emailVerification } from "../../server/utils/emailFunctions";
import requestWrapper from "../../server/utils/middleware";

async function handler(req, res) {
  const { token } = req.body;
  const emailVerificationRes = emailVerification(token);
  return res.status(emailVerificationRes.success ? 200 : 401).json(emailVerificationRes);
}

export default requestWrapper(handler, "POST");
