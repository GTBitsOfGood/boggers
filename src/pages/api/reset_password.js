import { getAccountRecovery } from "../../server/mongodb/actions/AccountRecovery";
import { updatePassword } from "../../server/mongodb/actions/User";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  if (req.method == "POST") {
    const accountRecovery = await getAccountRecovery(body.token);
    await updatePassword(accountRecovery.email, body.password);
    res.status(200).send();
  }
}
