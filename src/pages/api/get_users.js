import User from "../../server/mongodb/models/User";
import requestWrapper from "../../server/utils/middleware";

async function handler(req, res) {
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
          { "tenures.semester": { $in: [req.query.semester] } },
          { "tenures.year": { $in: [Number(req.query.year)] } },

          req.query.role == "All" ? {} : { "tenures.role": { $in: [req.query.role] } },
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
