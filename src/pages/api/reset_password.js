import {getAccountRecovery} from "../../server/mongodb/actions/AccountRecovery";
import {updatePassword} from "../../server/mongodb/actions/User";

export default async function handler(req, res) {
  res.status(200).send();
  const {token, password} = req.body;
  if (req.method == "POST") {
    const accountRecovery = await getAccountRecovery(token);
    await updatePassword(accountRecovery.email, password);
    res.status(200).send();
  }
}
