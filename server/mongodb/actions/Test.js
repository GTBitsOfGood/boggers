import connectMongo from "../../utils/connectMongo.js"
import Test from "../models/Test.js"

async function getTests() {
  await connectMongo();
  const tests = await Test.find({});
  return tests;
}

async function createTest(name) {
  await connectMongo();
  const newTest = await Test.create({ name });
  return newTest;
}

async function updateTest(id, name) {
  await connectMongo();
  const updatedTest = await Test.findByIdAndUpdate(id, { name }, { new: true });
  return updatedTest;
}

async function removeTest(id) {
  await connectMongo();
  const deletedTest = await Test.findByIdAndRemove(id);
  return deletedTest;
}

async function removeTestByName(name) {
  await connectMongo();
  const deletedTest = await Test.findOneAndDelete({ name });
  return deletedTest;
}

export {
  getTests,
  createTest,
  updateTest,
  removeTest,
  removeTestByName,
};