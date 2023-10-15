import User from "../../server/mongodb/models/User";
import requestWrapper from "../../server/utils/middleware";

async function handler(req, res) {
  const { query } = req.query;
  const users = await User.find({$or: [{email: {$regex: new RegExp(query, 'i')}}, {firstName: {$regex: new RegExp(query, 'i')}}, {phoneNumber: {$regex: new RegExp(query, 'i')}}]}).populate("tenures").sort({ firstName: 1, lastName: 1 });
  res.status(200).json({ users });
}

export default requestWrapper(handler, "GET");
