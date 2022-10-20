import {User} from "../models/InitSchema.js";
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

async function upsertUser(name, email, phoneNumber, preference, role, status) {
  const newUser = await User.findOneAndUpdate({name}, {email, phoneNumber, preference, role, status}, {upsert: true, new: true});
  return newUser;
}

export {getUser, createUser, upsertUser};
