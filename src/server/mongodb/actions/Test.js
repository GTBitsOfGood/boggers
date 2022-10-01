import dbConnect from "../connectMongo"
import Test from "../models/Test.js"

async function getTests() {
  await dbConnect();
  const tests = await Test.find({});
  return tests;
}

async function createTest(name) {
  await dbConnect();
  const newTest = await Test.create({ name });
  return newTest;
}

async function updateTest(id, name) {
  await dbConnect();
  const updatedTest = await Test.findByIdAndUpdate(id, { name }, { new: true });
  return updatedTest;
}

async function removeTest(id) {
  await dbConnect();
  const deletedTest = await Test.findByIdAndRemove(id);
  return deletedTest;
}

async function removeTestByName(name) {
  await dbConnect();
  const deletedTest = await Test.findOneAndDelete({ name });
  return deletedTest;
}

export default{
  getTests,
  createTest,
  updateTest,
  removeTest,
  removeTestByName,
};