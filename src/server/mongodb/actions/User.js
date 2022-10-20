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

async function upsertUser(name, email, phoneNumber, preference, role, status) {
  await connectMongo();
  const newUser = await User.findOneAndUpdate({name}, {email, phoneNumber, preference, role, status}, {upsert: true, new: true});
  return newUser;
}

export {getUser, createUser, upsertUser};
