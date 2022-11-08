import requestWrapper from "../../../utils/middleware";
import {createAccountRecovery} from "../../server/mongodb/actions/AccountRecovery";
import {getUser} from "../../server/mongodb/actions/User";
import sendAccountRecoveryEmail from "../../server/nodemailer/actions/accountRecovery";
import connectMailer from "../../server/nodemailer/connectMailer";

const forgotPasswordHandler = async function handler(req, res) {
  const body = JSON.parse(req.body);
  const user = await getUser(body.email);
  if (!user) {
    return res.status(404).send("User not found");
  }
  const accountRecovery = await createAccountRecovery(body.email);
  const transporter = await connectMailer();
  await sendAccountRecoveryEmail(transporter, accountRecovery.email, accountRecovery.token);
  res.status(200).send();
};

export default requestWrapper(forgotPasswordHandler, "POST");
