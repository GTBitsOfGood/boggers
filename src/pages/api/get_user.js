import { getToken } from "next-auth/jwt";
import { getUserById } from "../../server/mongodb/actions/User";
import { baseAzureUrl } from "../../server/utils/azureConfig";
import requestWrapper from "../../server/utils/middleware";

async function handler(req, res) {
  const user = await getToken({ req });
  if (!user) {
    console.error("User not authenticated");
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
        payload: { user: userData, imageUrl: userData.image ? baseAzureUrl + id : null },
      });
    } else {
      console.error("User does not exist in the database");
      res.status(400).json({
        success: false,
        message: "User does not exist in the database",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      success: false,
      message: "User does not exist in the database",
    });
  }
}

export default requestWrapper(handler, "GET");
