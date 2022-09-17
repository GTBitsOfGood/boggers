import connectMongo from "../../utils/connectMongo"
import Test from "../models/Test"

const getTests = async () => {
  await connectMongo();
  const tests = await Test.find({});
  return tests
}