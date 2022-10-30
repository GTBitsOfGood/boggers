import User from "../../server/mongodb/models/User";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  const users = await User.find({}).populate("tenures", "-userId");
  res.status(200).json({users});
}

export default requestWrapper(handler, "GET");
