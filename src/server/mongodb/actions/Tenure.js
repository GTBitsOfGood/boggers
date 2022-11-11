import Tenure from "../models/Tenure";

async function getTenure(userId, semester, year) {
  return Tenure.findOne({userId, semester, year});
}

async function upsertPreference(userId, semester, year, preference) {
  await Tenure.validate({userId, semester, year, preference});
  const newTenure = await Tenure.findOneAndUpdate({userId, semester, year}, {preference}, {upsert: true, new: true});
  return newTenure;
}

async function upsertTenure(userId, semester, year, department, role, project, preference, status, notes) {
  const toUpdate = {department, role, project, preference, status};
  if (notes != undefined && notes != null) {
    toUpdate.notes = notes;
  }

  await Tenure.validate({userId, semester, year, ...toUpdate});
  const newTenure = await Tenure.findOneAndUpdate({userId, semester, year}, toUpdate, {upsert: true, new: true});
  return newTenure;
}

async function upsertTenureCsv(userId, semester, year, preference, role, status) {
  await Tenure.validate({userId, semester, year, preference, role, status});
  const newTenure = await Tenure.findOneAndUpdate(
    {userId, semester, year},
    {preference, role, status},
    {upsert: true, new: true, runValidators: true},
  );
  return newTenure;
}

export {getTenure, upsertPreference, upsertTenure, upsertTenureCsv};
