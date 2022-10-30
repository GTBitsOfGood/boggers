import {upsertUserCsv, addTenure} from "../../server/mongodb/actions/User";
import {upsertTenureCsv} from "../../server/mongodb/actions/Tenure";
import {getToken} from "next-auth/jwt";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const user = await getToken({req});
  // console.log(user);
  if (!user) {
    return res.status(401).send("user not authenticated");
  } else if (user.access == 0) {
    return res.status(403).send("user is not an admin");
  }

  const {semester = "Fall", year = 2022} = req;

  const parsed = req.body.split("\r\n");
  for (let i = 1; i < parsed.length; i++) {
    if (parsed[i] == "") continue;
    const record = parsed[i].split(",");

    const [fullName, email, phoneNumber, preference, role, status] = record;
    console.log(fullName);
    const [firstName, lastName] = fullName.split(" ");
    const member = await upsertUserCsv(firstName, lastName, email, phoneNumber);
    console.log("member created");
    const tenure = await upsertTenureCsv(member._id, semester, year, preference, role, status);
    console.log("tenure created");
    await addTenure(member, tenure);
    console.log("tenure added to member");
  }
  res.status(200).json({
    success: true,
    message: "Upserted CSV records successfully",
  });
}

export default requestWrapper(handler, "POST");
