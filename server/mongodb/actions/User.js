import connectMongo from "../../utils/connectMongo";
import User from "../models/User";
import bcrypt from "bcrypt";

async function getUser(email) {
    await connectMongo();
    return User.findOne({ email });
}

async function createUser(email, name, password, admin = false, phoneNumber = undefined, preferences = undefined) {
    await connectMongo();
    return User.create({
        email,
        password: await bcrypt.hash(password, 10),
        name,
        admin,
        phoneNumber,
        preferences,
    });
}

export {
    getUser,
    createUser
};
