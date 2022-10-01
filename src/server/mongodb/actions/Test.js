import Test from "../models/Test.js"

async function getTests() {
  const tests = await Test.find({});
  return tests;
}

async function createTest(name) {
  const newTest = await Test.create({ name });
  return newTest;
}

async function updateTest(id, name) {
  const updatedTest = await Test.findByIdAndUpdate(id, { name }, { new: true });
  return updatedTest;
}

async function removeTest(id) {
  const deletedTest = await Test.findByIdAndRemove(id);
  return deletedTest;
}

async function removeTestByName(name) {
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
