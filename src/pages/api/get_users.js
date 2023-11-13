import User from "../../server/mongodb/models/User";
import requestWrapper from "../../server/utils/middleware";

async function handler(req, res) {
  const { query } = req.query;
  const users = await User.aggregate([
    {
      $lookup: {
        from: "tenures",
        as: "tenures",
        localField: "tenures",
        foreignField: "_id",
      },
    },
    {
      $match: {
        $and: [
          req.query.semester == "All" ? {} : { "tenures.semester": { $in: [req.query.semester] } },
          req.query.semester == "All" ? {} : { "tenures.year": { $in: [Number(req.query.year)] } },
          {
            $or: [
              { email: { $regex: new RegExp(query, "i") } },
              { firstName: { $regex: new RegExp(query, "i") } },
              { phoneNumber: { $regex: new RegExp(query, "i") } },
            ],
          },

          req.query.role == "All" ? {} : { "tenures.role": { $in: [req.query.role] } },
          req.query.department == "All" ? {} : { "tenures.department": { $in: [req.query.department] } },
        ],
      },
    },
    {
      $project: {
        id: "$_id",
        _id: 0,
        firstName: "$firstName",
        lastName: "$lastName",
        email: "$email",
        phoneNumber: "$phoneNumber",
        access: "$access",
        preference: "$preference",
        tenures: {
          $arrayToObject: {
            $map: {
              input: "$tenures",
              in: { k: req.query.semester + " " + req.query.year, v: "$$this" },
            },
          },
        },
      },
    },
  ]);
  res.status(200).json({ users });
}

export default requestWrapper(handler, "GET");
