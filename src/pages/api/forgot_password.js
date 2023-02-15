import requestWrapper from "../../server/utils/middleware";
import { getUser } from "../../server/mongodb/actions/User";
import { sendAccountRecovery } from "../../server/utils/emailFunctions";

const forgotPasswordHandler = async function handler(req, res) {
  let { email } = req.body;
  email = email?.toLowerCase().trim();
  const user = await getUser(email);
  if (!user) {
    return res.status(404).json({ success: false, exists: false, message: "User not found" });
  }
  if (!user.emailVerified) {
    return res.status(401).json({ success: false, exists: true, message: "User not verified" });
  }
  await sendAccountRecovery(email);
  res.status(200).json({ success: true });
};

export default requestWrapper(forgotPasswordHandler, "POST");
