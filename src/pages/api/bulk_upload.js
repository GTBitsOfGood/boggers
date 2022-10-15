import {upsertUser} from "../../../server/mongodb/actions/User.js";

export default async function handler(req, res) {
  // if (!req.authenticated) {
  //   res.status(401).send("user not authenticated")
  // } else if (!req.admin) {
  //   res.status(403).send("user is not an admin")
  // }
  const parsed = req.body.split("\r\n");
  for (let i = 1; i < parsed.length; i++) {
    if (parsed[i] == "") continue;
    const record = parsed[i].split(",");
    await upsertUser(...record);
  }
  res.status(200).end();
}
