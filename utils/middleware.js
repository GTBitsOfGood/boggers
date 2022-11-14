/* eslint-disable no-unused-vars */
import mongoose from "mongoose";
import urls from "./urls";
import User from "../src/server/mongodb/models/User";
import Tenure from "../src/server/mongodb/models/Tenure";

let cache = null;

export default function requestWrapper(handler, method) {
  return async (req, res) => {
    if (req.method !== method) {
      return res.status(400).json({
        success: false,
        message: "Request Failure: Invalid method for request",
      });
    }

    if (req.body !== "" && req.url !== urls.api.imageUpload) {
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

    if (!cache) {
      try {
        cache = await mongoose.connect(urls.dbUrl, {dbName: urls.dbName});
      } catch (error) {
        console.log(error);
        return res.status(400).json({
          success: false,
          message: "Error connecting to MongoDB",
        });
      }
    }

    return handler(req, res);
  };
}
