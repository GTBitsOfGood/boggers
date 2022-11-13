import connectMongo from "../connectMongo.js";
import {User} from "../models/InitSchema.js";
import bcrypt from "bcrypt";

async function getUser(email) {
  await connectMongo();
  return User.findOne({email});
}

async function createUser(email, name, password, admin = false) {
  await connectMongo();
  return await User.create({
    email,
    password: await bcrypt.hash(password, 10),
    name,
    admin,
  });
}

async function updatePassword(email, password) {
  await connectMongo();
  await User.updateOne({email}, {password: await bcrypt.hash(password, 10)});
}

async function setVerified(email) {
  await connectMongo();
  await User.updateOne({email}, {emailVerified: true});
}

async function changeEmail(email, newEmail) {
  await connectMongo();
  await User.updateOne({email}, {email: newEmail});
}

async function upsertUser(name, email, phoneNumber, preference, role, status) {
  await connectMongo();
  const newUser = await User.findOneAndUpdate({name}, {email, phoneNumber, preference, role, status}, {upsert: true, new: true});
  return newUser;
}

export {getUser, createUser, upsertUser, updatePassword, setVerified, changeEmail};
