import requestWrapper from "../../../utils/middleware";
import { getUser } from "../../server/mongodb/actions/User";
import { accountRecovery } from "../../server/utils/emailFunctions";

const forgotPasswordHandler = async function handler(req, res) {
  const { email } = req.body;
  const user = await getUser(email);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  accountRecovery(email);
  res.status(200).json({ success: true });
};

export default requestWrapper(forgotPasswordHandler, "POST");
