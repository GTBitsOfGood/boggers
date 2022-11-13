import connectMongo from "../../server/mongodb/connectMongo";
import {changeEmail, setVerified} from "../../server/mongodb/actions/User";
import {getEmailVerification} from "../../server/mongodb/actions/EmailVerification";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  if (req.method == "POST") {
    await connectMongo();
    const emailVerification = await getEmailVerification(body.token);
    if (emailVerification.newEmail) {
      await changeEmail(emailVerification.email, emailVerification.newEmail);
    } else {
      await setVerified(emailVerification.email);
    }
    res.status(200).send();
  }
}
