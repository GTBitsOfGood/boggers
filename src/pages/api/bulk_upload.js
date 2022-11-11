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

  // const {semester = "Fall", year = 2022} = req.body;

  // const parsed = req.body.csv.split(/\r?\n/);
  const parsed = [
    ["bogger", "boggers", "root@boggers.com", "4706665647", "Back-end", "Developer", "Active", "A", "P", "Fall", 2021],
    ["bogger", "boggers", "root@boggers.com", "4706665647", "Back-end", "Senior Dev", "Active", "B", "Q", "Spring", 2022],
    ["bogger", "boggers", "root@boggers.com", "4706665647", "Back-end", "Director", "Active", "C", "R", "Fall", 2022],
    ["bogger", "boggers", "root@boggers.com", "4706665647", "Front-end", "Alumni", "Inactive", "-", "-", "Spring", 2023],
  ];
  for (let i = 0; i < parsed.length; i++) {
    if (parsed[i] == "") continue;
    const record = parsed[i];
    const [firstName, lastName, email, phoneNumber, preference, role, status, project, department, semester, year] = record;
    const member = await upsertUserCsv(firstName, lastName, email, phoneNumber, preference);
    const tenure = await upsertTenureCsv(member._id, semester, year, role, status, project, department);
    await addTenure(member._id, tenure);
  }
  res.status(200).json({
    success: true,
    message: "Upserted CSV records successfully",
  });
}

export default requestWrapper(handler, "GET");
