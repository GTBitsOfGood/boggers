import requestWrapper from "../../../utils/middleware";
import { createAccountRecovery } from "../../server/mongodb/actions/AccountRecovery";
import { getUser } from "../../server/mongodb/actions/User";
import sendAccountRecoveryEmail from "../../server/nodemailer/actions/accountRecovery";
import connectMailer from "../../server/nodemailer/connectMailer";

const forgotPasswordHandler = async function handler(req, res) {
  const { email } = req.body;
  const user = await getUser(email);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  createAccountRecovery(email)
    .then(
      (accountRecovery) =>
        new Promise((resolve, reject) => {
          connectMailer()
            .then((transporter) => resolve({ accountRecovery, transporter }))
            .catch((err) => reject(err));
        }),
    )
    .then(({ accountRecovery, transporter }) => sendAccountRecoveryEmail(transporter, accountRecovery.email, accountRecovery.token))
    .catch((err) => console.log(err));

  res.status(200).json({ success: true });
};

export default requestWrapper(forgotPasswordHandler, "POST");
