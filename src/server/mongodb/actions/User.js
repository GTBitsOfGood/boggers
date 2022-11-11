import User from "../models/User";
import bcrypt from "bcrypt";

async function getUser(email) {
  return User.findOne({email});
}

async function getUserById(id) {
  return User.findById(id);
}

async function createUser(firstName, lastName, email, phoneNumber, preference) {
  return await User.create({firstName, lastName, email, phoneNumber, preference});
}

async function createRootUser() {
  return await User.create({
    email: "root@boggers.com",
    password: await bcrypt.hash("root", 10),
    firstName: "boggers",
    lastName: "boggers",
    access: 2,
  });
}

async function updateUser(userId, firstName, lastName, email, phoneNumber, preference) {
  return await User.findByIdAndUpdate(
    userId,
    {firstName, lastName, email, phoneNumber, preference},
    {new: true, runValidators: true, context: "query"},
  );
}

async function updatePassword(email, password) {
  await User.updateOne({email}, {$set: {password: await bcrypt.hash(password, 10)}});
}

async function upsertUserCsv(firstName, lastName, email, phoneNumber, preference) {
  await User.validate({firstName, lastName, email, phoneNumber, preference});
  const newUser = await User.findOneAndUpdate({firstName, lastName}, {email, phoneNumber, preference}, {upsert: true, new: true});
  return newUser;
}

async function addTenure(userId, tenure) {
  return await User.findOneAndUpdate({_id: userId, tenures: {$ne: tenure._id}}, {$addToSet: {tenures: tenure._id}}, {new: true});
}

async function addImage(id) {
  const user = await User.findById(id).select("image");
  if (!user.image) {
    await User.findByIdAndUpdate(id, {image: true});
  }
}

export {getUser, getUserById, createUser, createRootUser, updateUser, upsertUserCsv, addTenure, updatePassword, addImage};
