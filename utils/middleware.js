/* eslint-disable no-unused-vars */
import urls from "./urls";
import User from "../src/server/mongodb/models/User";
import Tenure from "../src/server/mongodb/models/Tenure";
import AccountRecovery from "../src/server/mongodb/models/AccountRecovery";
import EmailVerification from "../src/server/mongodb/models/EmailVerification";
import connectMongo from "../src/server/mongodb/connectMongo";

export default function requestWrapper(handler, method) {
  return async (req, res) => {
    if (req.method !== method) {
      return res.status(400).json({
        success: false,
        message: "Request Failure: Invalid method for request",
      });
    }
    if (req.body !== "" && req.url !== urls.api.imageUpload && req.url !== urls.api.bulkUpload) {
      try {
        req.body = JSON.parse(req.body);
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: false,
          message: "Invalid request body",
        });
      }
    }

    const mongoRes = await connectMongo();
    if (!mongoRes.success) {
      return mongoRes;
    }

    return handler(req, res);
  };
}
