import connectMongo from "../../server/mongodb/connectMongo";
import { createEmailChangeVerification } from "../../server/mongodb/actions/EmailVerification";

export default async function handler(req, res) {
  const body = JSON.parse(req.body);
  if (req.method == "POST") {
    await connectMongo();
    await createEmailChangeVerification(body.email, body.newEmail);
    res.status(200).send();
  }
}
