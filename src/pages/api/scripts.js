import User from "../../server/mongodb/models/User";
import Tenure from "../../server/mongodb/models/Tenure";
import AccountRecovery from "../../server/mongodb/models/AccountRecovery";
import EmailVerification from "../../server/mongodb/models/EmailVerification";
import { createRootUser, createSeedUser } from "../../server/mongodb/actions/User";
import requestWrapper from "../../server/utils/middleware";

async function handler(req, res) {
  if (process.env.NODE_ENV === "production") {
    if (req.query.scriptsPassword !== process.env.SCRIPTS_PASSWORD || req.query.task === "deleteAll") {
      return res.status(404).end();
    }
  }

  switch (req.query.task) {
    case "seed": {
      const user = await createRootUser();
      return res.status(200).json(user);
    }
    case "seedCredentials": {
      const { email, password, access } = req.query;
      if (!email || !password) return res.status(400).json({ error: "Missing/Invalid email or password" });

      const user = await createSeedUser(email, password, access);
      return res.status(200).json(user);
    }
    case "deleteAll": {
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
      try {
        await AccountRecovery.collection.drop();
      } catch (error) {
        // empty
      }
      try {
        await EmailVerification.collection.drop();
      } catch (error) {
        // empty
      }
      return res.status(201).json({ success: true });
    }
  }
}

export default requestWrapper(handler, "GET");
