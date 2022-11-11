import {getToken} from "next-auth/jwt";
import {getUserById} from "../../server/mongodb/actions/User";
import {baseAwsUrl} from "../../../utils/awsConfig";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const user = await getToken({req});
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const userData = await getUserById(user.user.id);

  res.status(200).json({
    success: true,
    payload: {user: userData, imageUrl: userData.image ? baseAwsUrl + user.user.id : null},
  });
}

export default requestWrapper(handler, "GET");
