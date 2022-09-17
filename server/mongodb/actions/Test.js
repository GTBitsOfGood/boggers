import connectMongo from "../../utils/connectMongo.js"
import Test from "../models/Test.js"

const getTests = async () => {
  await connectMongo();
  const tests = await Test.find({});
  return tests;
}

export {
  getTests
};