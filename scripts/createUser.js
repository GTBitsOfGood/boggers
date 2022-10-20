import * as dotenv from "dotenv";
import mongoose from "mongoose";
import {createUser} from "../server/mongodb/actions/User";

dotenv.config({
  path: ".env.local",
});

createUser("root@boggers.com", "boggers", "root", true).then((user) => {
  console.log(user);
  mongoose.connection.close();
});
