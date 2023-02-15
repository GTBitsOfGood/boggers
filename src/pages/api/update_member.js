import { getToken } from "next-auth/jwt";
import { upsertTenure } from "../../server/mongodb/actions/Tenure";
import { updateUser, addTenure, createUser, getUser, changeEmail } from "../../server/mongodb/actions/User";
import { deleteEmailVerification, deleteNewEmailVerification } from "../../server/mongodb/actions/EmailVerification";
import requestWrapper from "../../server/utils/middleware";
import { sendEmailVerification } from "../../server/utils/emailFunctions";

async function handler(req, res) {
  const user = (await getToken({ req }))?.user;
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const {
    isMemberView,
    firstName,
    lastName,
    phoneNumber,
    preference,
    originalAccess,
    access,
    semester,
    year,
    department,
    role,
    project,
    status,
    notes,
  } = req.body;
  let { originalEmail, email, memberId } = req.body;

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
  } else if (
    !isMemberView &&
    (user.access < access || (typeof originalAccess != "undefined" && originalAccess !== access && user.access <= originalAccess))
  ) {
    return res.status(401).json({
      success: false,
      message: "User does not have correct access level to upgrade/downgrade member's access level",
    });
  }

  originalEmail = originalEmail?.toLowerCase().trim();
  email = email?.toLowerCase().trim();

  let emailChanged = !originalEmail || originalEmail !== email;
  const emailExists = new Promise((resolve) => getUser(email).then((user) => resolve(!!user)));

  let member, tenure;
  try {
    if (memberId) {
      member = await updateUser(memberId, firstName, lastName, originalEmail, phoneNumber, preference, access);
      if (emailChanged) {
        if (await emailExists) {
          emailChanged = false;
        } else {
          await deleteEmailVerification(originalEmail);
          if (member.emailVerified) {
            await sendEmailVerification(originalEmail, email);
          } else {
            await deleteNewEmailVerification(email);
            await changeEmail(originalEmail, email);
            member.email = email;
            await sendEmailVerification(email);
          }
        }
      }
    } else {
      if (await emailExists) {
        emailChanged = false;
      } else {
        member = await createUser(firstName, lastName, email, phoneNumber, preference, access);
        await sendEmailVerification(email);
      }
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
    id: member.id,
    email: member.email,
    message: "Updated record successfully",
  });
}

export default requestWrapper(handler, "PUT");
