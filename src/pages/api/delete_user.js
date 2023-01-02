import { getToken } from "next-auth/jwt";
import requestWrapper from "../../../utils/middleware";
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

  if (user.user.access < 1) {
    return res.status(401).json({
      success: false,
      message: "User does not have correct access level",
    });
  }

  const { id } = req.body;
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
