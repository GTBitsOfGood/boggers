import { getToken } from "next-auth/jwt";
import { upsertTenure } from "../../server/mongodb/actions/Tenure";
import { updateUser, addTenure, createUser, getUser } from "../../server/mongodb/actions/User";
import requestWrapper from "../../../utils/middleware";
import { createEmailChangeVerification } from "../../server/mongodb/actions/EmailVerification";
import connectMailer from "../../server/nodemailer/connectMailer";
import sendEmailVerificationEmail from "../../server/nodemailer/actions/emailVerification";

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
    originalEmail,
    email,
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
  let { memberId } = req.body;

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

  let emailChanged = !originalEmail || originalEmail !== email;
  let member, tenure;
  try {
    if (memberId) {
      member = await updateUser(memberId, firstName, lastName, originalEmail, phoneNumber, preference, access);
      if (emailChanged) {
        const emailExists = !!(await getUser(email));
        if (emailExists) {
          emailChanged = false;
        } else {
          createEmailChangeVerification(originalEmail, email)
            .then(
              (accountRecovery) =>
                new Promise((resolve, reject) => {
                  connectMailer()
                    .then((transporter) => resolve({ accountRecovery, transporter }))
                    .catch((err) => reject(err));
                }),
            )
            .then(({ accountRecovery, transporter }) => sendEmailVerificationEmail(transporter, email, accountRecovery.token))
            .catch((err) => {
              console.log(err);
            });
        }
      }
    } else {
      member = await createUser(firstName, lastName, email, phoneNumber, preference, access);
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
    message: "Updated record successfully",
  });
}

export default requestWrapper(handler, "PUT");
