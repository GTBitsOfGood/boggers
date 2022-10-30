import mongoose from "mongoose";
import {dbUrl} from "./urls";

let cache = null;

export default function requestWrapper(handler, method) {
  return async (req, res) => {
    if (req.method !== method) {
      return res.status(400).json({
        success: false,
        message: "Request Failure: Invalid method for request",
      });
    }

    if (!cache) {
      cache = await mongoose.connect(dbUrl);
    }

    return handler(req, res);
  };
}
