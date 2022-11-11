import {getToken} from "next-auth/jwt";
import {upsertPreference, upsertTenure} from "../../server/mongodb/actions/Tenure";
import {createUser, updateUser, addTenure} from "../../server/mongodb/actions/User";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const user = await getToken({req});
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const {
    memberId,
    firstName,
    lastName,
    email,
    phoneNumber,
    semester,
    year,
    department,
    role,
    project,
    preference,
    status,
    notes,
    isAdminView,
  } = req.body;

  if (user.access === 0 && user._id !== memberId) {
    return res.status(401).json({
      success: false,
      message: "User does not have the correct access level",
    });
  }

  let member;
  if (memberId) {
    member = await updateUser(memberId, firstName, lastName, email, phoneNumber);
  } else {
    member = await createUser(firstName, lastName, email, phoneNumber);
  }

  if (isAdminView) {
    const tenure = await upsertTenure(member._id, semester, year, department, role, project, preference, status, notes);
    await addTenure(member._id, tenure);
  } else {
    console.log(preference);
    const tenure = await upsertPreference(member._id, semester, year, preference);
    await addTenure(member._id, tenure);
  }

  res.status(200).json({
    success: true,
    message: "Updated record successfully",
  });
}

export default requestWrapper(handler, "PUT");
