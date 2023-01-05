import { getToken } from "next-auth/jwt";
import requestWrapper from "../../../utils/middleware";
import { deleteTenure } from "../../server/mongodb/actions/Tenure";

async function handler(req, res) {
  const user = await getToken({ req });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: "User not authenticated",
    });
  }

  const { id, semester, year } = req.body;

  if (user.user.access < 1) {
    return res.status(401).json({
      success: false,
      message: "User does not have correct access level",
    });
  }

  try {
    await deleteTenure(id, semester, year);
    res.status(202).json({
      success: true,
      message: "Tenure has been deleted",
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({
      success: false,
      message: "User/Tenure does not exist in the database",
    });
  }
}

export default requestWrapper(handler, "DELETE");
