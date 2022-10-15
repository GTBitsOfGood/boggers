import connectMongo from "../../utils/connectMongo.js";
import {User} from "../models/InitSchema.js";

async function upsertUser(name, email, phoneNumber, preference, role, status) {
  await connectMongo();
  const newUser = await User.findOneAndUpdate({name}, {email, phoneNumber, preference, role, status}, {upsert: true, new: true});
  return newUser;
}

export {upsertUser};
