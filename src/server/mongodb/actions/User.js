import User from "../models/User";
import bcrypt from "bcrypt";

async function getUser(email) {
  return User.findOne({email});
}

async function createUser(firstName, lastName, email, phoneNumber) {
  return await User.create({firstName, lastName, email, phoneNumber});
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

async function updateUser(userId, firstName, lastName, email, phoneNumber) {
  return await User.findByIdAndUpdate(
    userId,
    {firstName, lastName, email, phoneNumber},
    {new: true, runValidators: true, context: "query"},
  );
}

async function upsertUserCsv(firstName, lastName, email, phoneNumber) {
  await User.validate({firstName, lastName, email, phoneNumber});
  const newUser = await User.findOneAndUpdate({firstName, lastName}, {email, phoneNumber}, {upsert: true, new: true});
  return newUser;
}

async function addTenure(userId, tenure) {
  return await User.findOneAndUpdate({_id: userId, tenures: {$ne: tenure._id}}, {$addToSet: {tenures: tenure._id}}, {new: true});
}

export {getUser, createUser, createRootUser, updateUser, upsertUserCsv, addTenure};
