/* eslint-disable no-unused-vars */

import User from "../models/User";
import bcrypt from "bcrypt";

async function getUser(email) {
  return User.findOne({ email });
}

async function getUserVerificationStatus(email) {
  return User.findOne({ email }, { emailVerified: 1 });
}

async function getUserById(id) {
  return User.findById(id).populate("tenures", "-_id");
}
/* es*/
async function getUsers() {
  return User.find({});
}

async function createUser(firstName, lastName, email, phoneNumber, preference, access) {
  return await User.create({ firstName, lastName, email, phoneNumber, preference, access });
}

async function deleteUser(id) {
  const res = await User.deleteOne({ _id: id });
  return res;
}
async function createRootUser() {
  try {
    const user = await User.create({
      email: "root@boggers.com",
      password: await bcrypt.hash("root", 10),
      firstName: "boggers",
      lastName: "boggers",
      access: 2,
      emailVerified: true,
    });

    return user;
  } catch (error) {
    if (error.code === 11000) {
      return {
        error: "Duplicate email",
      };
    } else {
      return {
        error: "Error is" + error.message,
      };
    }
  }
}

async function createSeedUser(email, password, access) {
  return await User.create({ email, password: await bcrypt.hash(password, 10), firstName: "seed", lastName: "seed", access });
}

async function setVerified(email) {
  return User.updateOne({ email }, { emailVerified: true });
}

async function changeEmail(email, newEmail) {
  return User.updateOne({ email }, { email: newEmail }, { new: true });
}

async function upsertUserEmail(firstName, lastName, email, phoneNumber, preference, access) {
  const newUser = await User.findOneAndUpdate(
    { email },
    { firstName, lastName, phoneNumber, preference, access },
    { upsert: true, new: true },
  );
  return newUser;
}

async function updateUser(userId, firstName, lastName, email, phoneNumber, preference, access) {
  return await User.findByIdAndUpdate(
    userId,
    { firstName, lastName, email, phoneNumber, preference, access },
    { new: true, runValidators: true, context: "query" },
  );
}

async function updatePassword(email, password) {
  await User.updateOne({ email }, { $set: { password: await bcrypt.hash(password, 10) } });
}

async function upsertUserCsv(firstName, lastName, email, phoneNumber, preference) {
  await User.validate({ firstName, lastName, email, phoneNumber, preference });
  const newUser = await User.findOneAndUpdate(
    { email },
    { firstName, lastName, phoneNumber, preference },
    { upsert: true, new: true, rawResult: true },
  );
  return [newUser.value, !newUser.lastErrorObject.updatedExisting];
}

async function addTenure(userId, tenure) {
  return await User.findOneAndUpdate({ _id: userId }, { $addToSet: { tenures: tenure._id } }, { new: true });
}

async function addImage(id) {
  return await User.findByIdAndUpdate(id, { image: true });
}

async function deleteImage(id) {
  return await User.findByIdAndUpdate(id, { image: false });
}

export {
  getUser,
  getUserVerificationStatus,
  getUserById,
  createUser,
  createRootUser,
  createSeedUser,
  deleteUser,
  updateUser,
  upsertUserEmail,
  upsertUserCsv,
  addTenure,
  updatePassword,
  addImage,
  deleteImage,
  setVerified,
  changeEmail,
};
