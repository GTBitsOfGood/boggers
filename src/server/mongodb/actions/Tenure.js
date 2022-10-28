import Tenure from "../models/Tenure";

async function getTenure(userId, semester, year) {
  return Tenure.findOne({userId, semester, year});
}

async function upsertTenure(userId, semester, year, department, role, project, preference, status, notes) {
  const toUpdate = {department, role, project, preference, status};
  if (notes != undefined && notes != null) {
    toUpdate.notes = notes;
  }

  const newUser = await Tenure.findOneAndUpdate({_id: userId, semester, year}, toUpdate, {upsert: true, new: true});
  return newUser;
}

async function upsertTenureCsv(firstName, lastName, semester, year, preference, role, status) {
  const newUser = await Tenure.findOneAndUpdate(
    {firstName, lastName, semester, year},
    {preference, role, status},
    {upsert: true, new: true},
  );
  return newUser;
}

export {getTenure, upsertTenure, upsertTenureCsv};
