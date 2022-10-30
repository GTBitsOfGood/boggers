import User from "../models/User";
import bcrypt from "bcrypt";

async function getUser(email) {
  return User.findOne({email});
}

async function createUser(email, firstName, lastName, password, access = 0) {
  return await User.create({
    email,
    password: await bcrypt.hash(password, 10),
    firstName,
    lastName,
    access,
  });
}

async function upsertUserCsv(firstName, lastName, email, phoneNumber) {
  await User.validate({firstName, lastName, email, phoneNumber});
  const newUser = await User.findOneAndUpdate({firstName, lastName}, {email, phoneNumber}, {upsert: true, new: true});
  return newUser;
}

async function addTenure(user, tenure) {
  const tenures = user.tenures.concat(tenure._id);
  return await User.findByIdAndUpdate(user._id, {tenures}, {new: true, runValidators: true});
}

export {getUser, createUser, upsertUserCsv, addTenure};
