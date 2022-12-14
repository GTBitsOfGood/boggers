import { getToken } from "next-auth/jwt";
import requestWrapper from "../../server/utils/middleware";
import { deleteUser } from "../../server/mongodb/actions/User";
import { deleteTenures } from "../../server/mongodb/actions/Tenure";

async function handler(req, res) {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const { id, access } = req.body;

  if (user.user.access < 1 || user.user.access <= access) {
    return res.status(401).json({
      success: false,
      message: "User does not have correct access level",
    });
  }

  try {
    await deleteTenures(id);
    await deleteUser(id);
    res.status(202).json({
      success: true,
      message: "User has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "User does not exist in the database",
    });
  }
}

export default requestWrapper(handler, "DELETE");
