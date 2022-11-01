import connectMongo from "../../server/mongodb/connectMongo";
import {getAccountRecovery} from "../../server/mongodb/actions/AccountRecovery";
import {updatePassword} from "../../server/mongodb/actions/User";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  if (req.method == "POST") {
    await connectMongo();
    const accountRecovery = await getAccountRecovery(body.token);
    await updatePassword(accountRecovery.email, body.password);
    res.status(200).send();
  }
}
