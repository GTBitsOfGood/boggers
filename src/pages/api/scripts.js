// import User from "../../server/mongodb/models/User";
// import Tenure from "../../server/mongodb/models/Tenure";
import {createRootUser, createSeedUser} from "../../server/mongodb/actions/User";
import requestWrapper from "../../../utils/middleware";

async function handler(req, res) {
  if (process.env.NODE_ENV === "production") return res.status(404).end();
  console.log(req.query.task);
  switch (req.query.task) {
    case "seed": {
      try {
        // await User.collection.drop();
      } catch (error) {
        // empty
      }
      try {
        // await Tenure.collection.drop();
      } catch (error) {
        // empty
      }
      const user = await createRootUser();
      return res.status(200).json(user);
    }
    case "seedCredentials": {
      console.log("no");
      const {email, password, access} = req.query;
      if (!email || !password) return res.status(400).json({error: "Missing/Invalid email or password"});

      const user = await createSeedUser(email, password, access);
      return res.status(200).json(user);
    }
  }
}

export default requestWrapper(handler, "GET");
