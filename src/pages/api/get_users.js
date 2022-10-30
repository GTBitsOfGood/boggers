import User from "../../server/mongodb/models/User";
import requestWrapper from "../../../utils/middleware";
import mongoose from "mongoose";

async function handler(req, res) {
  const users = await User.find({}).populate("tenures", "-userId");
  console.log(mongoose.connections.length);
  res.status(200).json({users});
}

export default requestWrapper(handler, "GET");
