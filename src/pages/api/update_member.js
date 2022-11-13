import {getToken} from "next-auth/jwt";
import {upsertTenure} from "../../server/mongodb/actions/Tenure";
import {createUser, updateUser, addTenure} from "../../server/mongodb/actions/User";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const user = (await getToken({req}))?.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const {memberId, firstName, lastName, email, phoneNumber, preference, semester, year, department, role, project, status, notes} =
    req.body;

  if (user.access === 0 && user.id !== memberId) {
    return res.status(401).json({
      success: false,
      message: "User does not have the correct access level",
    });
  }

  try {
    let member;
    if (memberId) {
      member = await updateUser(memberId, firstName, lastName, email, phoneNumber, preference);
    } else {
      member = await createUser(firstName, lastName, email, phoneNumber, preference);
    }

    if (user.access > 0) {
      const tenure = await upsertTenure(member._id, semester, year, department, role, project, status, notes);
      await addTenure(member._id, tenure);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      success: false,
      message: error.name === "ValidationError" ? "Invalid user data" : "Error adding user data to MongoDB",
    });
  }

  res.status(200).json({
    success: true,
    message: "Updated record successfully",
  });
}

export default requestWrapper(handler, "PUT");
