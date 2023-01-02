import {getToken} from "next-auth/jwt";
import {upsertTenure} from "../../server/mongodb/actions/Tenure";
import {createUser, updateUser, addTenure, getUserById} from "../../server/mongodb/actions/User";
import requestWrapper from "../../../utils/middleware";
import {createEmailChangeVerification} from "../../server/mongodb/actions/EmailVerification";
import connectMailer from "../../server/nodemailer/connectMailer";
import sendEmailVerificationEmail from "../../server/nodemailer/actions/emailVerification";

async function handler(req, res) {
  const user = (await getToken({req}))?.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const {isMemberView, firstName, lastName, email, phoneNumber, preference, semester, year, department, role, project, status, notes} =
    req.body;
  let {memberId} = req.body;

  let emailChanged = false;

  if (isMemberView && user.id !== memberId) {
    return res.status(401).json({
      success: false,
      message: "User cannot modify other members in Member View",
    });
  } else if (!isMemberView && user.access < 1) {
    return res.status(401).json({
      success: false,
      message: "User does not have the correct access level",
    });
  }

  let member, tenure;
  try {
    if (memberId) {
      const originalEntry = await getUserById(memberId);
      member = await updateUser(memberId, firstName, lastName, originalEntry.email, phoneNumber, preference);
      if (originalEntry.email !== email) {
        emailChanged = true;
        const accountRecovery = await createEmailChangeVerification(originalEntry.email, email);
        const transporter = await connectMailer();
        await sendEmailVerificationEmail(transporter, email, accountRecovery.token);
      }
    } else {
      member = await createUser(firstName, lastName, email, phoneNumber, preference);
    }

    if (!isMemberView) {
      tenure = await upsertTenure(member._id, semester, year, department, role, project, status, notes);
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
    emailChanged,
    user: await member.populate("tenures"),
    message: "Updated record successfully",
  });
}

export default requestWrapper(handler, "PUT");
