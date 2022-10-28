import User from "../models/User";
import bcrypt from "bcrypt";

async function getUser(email) {
  return User.findOne({email});
}

async function createUser(email, name, password, access = 0) {
  return await User.create({
    email,
    password: await bcrypt.hash(password, 10),
    name,
    access,
  });
}

async function upsertUserCsv(userId, firstName, lastName, email, phoneNumber) {
  const newUser = await User.findOneAndUpdate({firstName, lastName}, {email, phoneNumber}, {upsert: true, new: true});
  return newUser;
}

export {getUser, createUser, upsertUserCsv};
