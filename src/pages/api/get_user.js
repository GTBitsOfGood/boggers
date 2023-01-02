import { getToken } from "next-auth/jwt";
import { getUserById } from "../../server/mongodb/actions/User";
import { baseAwsUrl } from "../../../utils/awsConfig";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const { id } = user.user;
  try {
    const userData = await getUserById(id);
    if (userData) {
      res.status(200).json({
        success: true,
        payload: { user: userData, imageUrl: userData.image ? baseAwsUrl + id : null },
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User does not exist in the database",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "User does not exist in the database",
    });
  }
}

export default requestWrapper(handler, "GET");
