import Tenure from "../models/Tenure";
import User from "../models/User";

async function getTenure(userId, semester, year) {
  return Tenure.findOne({userId, semester, year});
}

async function createTenure(userId, semester, year, department, role, project, preferences, status, notes) {
  const tenure = await Tenure.create({userId, semester, year, department, role, project, preferences, status, notes});
  const user = await User.findById(userId);
  user.tenures = user.tenures.concat(tenure);
  await user.save();

  return tenure;
}

async function upsertTenure(userId, semester, year, department, role, project, preferences, status, notes) {
  const newUser = await Tenure.findOneAndUpdate(
    {_id: userId, semester, year},
    {department, role, project, preferences, status, notes},
    {upsert: true, new: true},
  );
  return newUser;
}

export {getTenure, createTenure, upsertTenure};
