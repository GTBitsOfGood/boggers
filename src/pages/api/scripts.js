import connectMongo from "../../server/mongodb/connectMongo";
import User from "../../server/mongodb/models/User";
import Tenure from "../../server/mongodb/models/Tenure";
import {createUser} from "../../server/mongodb/actions/User";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  if (process.env.NODE_ENV === "production") return res.status(404).end();

  switch (req.query.task) {
    case "seed": {
      await connectMongo();
      try {
        await User.collection.drop();
      } catch (error) {
        // empty
      }
      try {
        await Tenure.collection.drop();
      } catch (error) {
        // empty
      }
      const user = await createUser("root@boggers.com", "boggers", "boggers", "root", 2);
      return res.status(200).json(user);
    }
  }
}

export default requestWrapper(handler, "POST");
