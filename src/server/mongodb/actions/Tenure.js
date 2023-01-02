import Tenure from "../models/Tenure";

async function getTenures() {
  return Tenure.find({});
}

async function getTenure(userId, semester, year) {
  return Tenure.findOne({ userId, semester, year });
}

async function upsertTenure(userId, semester, year, department, role, project, status, notes) {
  const toUpdate = { department, role, project, status };
  if (notes != undefined && notes != null) {
    toUpdate.notes = notes;
  }

  await Tenure.validate({ userId, semester, year, ...toUpdate });
  const newTenure = await Tenure.findOneAndUpdate({ userId, semester, year }, toUpdate, { upsert: true, new: true });
  return newTenure;
}

async function upsertTenureCsv(userId, semester, year, role, status, project, department) {
  await Tenure.validate({ userId, semester, year, role, status, project, department });
  const newTenure = await Tenure.findOneAndUpdate(
    { userId, semester, year },
    { role, status, project, department },
    { upsert: true, new: true, runValidators: true },
  );
  return newTenure;
}

async function deleteTenure(userId, semester, year) {
  const res = await Tenure.deleteOne({ userId, semester, year });
  return res;
}

async function deleteTenures(userId) {
  const res = await Tenure.deleteMany({ userId });
  return res;
}

export { getTenures, getTenure, upsertTenure, upsertTenureCsv, deleteTenure, deleteTenures };
