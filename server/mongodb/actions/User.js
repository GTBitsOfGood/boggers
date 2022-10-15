import connectMongo from "../../utils/connectMongo.js";
import {User} from "../models/InitSchema.js";

async function createUser(name, email, phoneNumber, preference, role, status) {
  await connectMongo();
  const newUser = await User.create({name, email, phoneNumber, preference, role, status});
  return newUser;
}

export {createUser};
