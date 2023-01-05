import mongoose from "mongoose";
import urls from "../../../utils/urls";

const connectMongo = async () => {
  if (!global.cache) {
    try {
      global.cache = await mongoose.connect(urls.dbUrl, { dbName: urls.dbName });
      return { success: true };
    } catch (error) {
      console.log(error);
      return {
        success: false,
        message: "Error connecting to MongoDB",
      };
    }
  }
  return { success: true };
};

export default connectMongo;
