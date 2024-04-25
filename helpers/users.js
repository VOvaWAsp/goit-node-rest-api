// import jwt from "jsonwebtoken";
import { User } from "../services/usersServices.js";
import HttpError from "./HttpError.js";

export const registerUser = async (user) => {
    const { email } = user;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        return HttpError(409, { message: "Email is already in use" });
    }

    const newUser = await User.create({ ...user });

    // const id = newUser.id;
    // const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: "1h" });
    // newUser.token = token;

    await newUser.save();

    newUser.password = undefined;
    return { newUser };
};