import {upsertUser} from "../../server/mongodb/actions/User.js";
import {authOptions} from "./auth/[...nextauth]";

// eslint-disable-next-line camelcase
import {unstable_getServerSession} from "next-auth";

export default async function handler(req, res) {
  const user = (await unstable_getServerSession(req, res, authOptions)).user;
  if (!user) {
    res.status(401).send("user not authenticated");
  } else if (user.access == 0) {
    res.status(403).send("user is not an admin");
  }

  const parsed = req.body.split("\r\n");
  for (let i = 1; i < parsed.length; i++) {
    if (parsed[i] == "") continue;
    const record = parsed[i].split(",");
    await upsertUser(...record);
  }
  res.status(200).end();
}
