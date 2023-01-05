import { getAndDeleteAccountRecovery } from "../../server/mongodb/actions/AccountRecovery";
import { updatePassword } from "../../server/mongodb/actions/User";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const { token, password } = req.body;
  const accountRecovery = await getAndDeleteAccountRecovery(token);
  if (!accountRecovery) {
    return res.status(401).json({ success: false });
  }
  await updatePassword(accountRecovery.email, password);
  res.status(200).json({ success: true });
}

export default requestWrapper(handler, "POST");
