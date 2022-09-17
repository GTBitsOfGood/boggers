import connectMongo from "../../utils/connectMongo.js"
import Test from "../models/Test.js"

async function getTests() {
  await connectMongo();
  const tests = await Test.find({});
  return tests;
}

export {
  getTests
};