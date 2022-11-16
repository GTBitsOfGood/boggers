import {upsertUserCsv, addTenure} from "../../server/mongodb/actions/User";
import {upsertTenureCsv} from "../../server/mongodb/actions/Tenure";
import {getToken} from "next-auth/jwt";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const user = await getToken({req});
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  } else if (user.access == 0) {
    return res.status(401).json({
      success: false,
      message: "User is not an admin",
    });
  }

  const csv = req.body;
  const parsed = csv.split(/\r?\n/);
  console.log(parsed);
  for (let i = 1; i < parsed.length; i++) {
    if (parsed[i] == "") continue;
    const record = parsed[i];
    const [firstName, lastName, email, phoneNumber, preference, role, status, project, department, semester, year] = record.split(",");

    const member = await upsertUserCsv(firstName, lastName, email, phoneNumber, preference);
    const tenure = await upsertTenureCsv(member._id, semester, year, role, status, project, department);
    await addTenure(member._id, tenure);
  }
  res.status(200).json({
    success: true,
    message: "Upserted CSV records successfully",
  });
}

export default requestWrapper(handler, "POST");
