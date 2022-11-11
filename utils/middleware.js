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

    if (req.body !== "" && req.url !== "/api/image_upload") {
      req.body = JSON.parse(req.body);
    }

    if (!cache) {
      cache = await mongoose.connect(urls.dbUrl, {dbName: urls.dbName});
    }

    return handler(req, res);
  };
}
