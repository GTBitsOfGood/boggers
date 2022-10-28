import User from "../models/User";
import bcrypt from "bcrypt";

async function getUser(email) {
  return User.findOne({email});
}

async function createUser(email, name, password, admin = false) {
  return await User.create({
    email,
    password: await bcrypt.hash(password, 10),
    name,
    admin,
  });
}

async function upsertUser(userId, name, email, phoneNumber) {
  const newUser = await User.findOneAndUpdate({_id: userId}, {name, email, phoneNumber}, {upsert: true, new: true});
  return newUser;
}

export {getUser, createUser, upsertUser};
