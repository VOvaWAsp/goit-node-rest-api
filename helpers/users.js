// import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import path from "path"

import { User } from "../services/usersServices.js";
import HttpError from "./HttpError.js";
import { Types } from "mongoose";

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

    newUser.avatarURL = gravatar.url(email, {s: '200', r: 'pg', d: '404'});

    await newUser.save();

    newUser.password = undefined;
    return { newUser };
};

export const updateAvatarImage = async(user, file) => {
    const id = user.id

    const valid = Types.ObjectId.isValid(id);
    
    if (!valid) return res.status(404).json({"message": "Not found"});
    
    const currentUser = await User.findByIdAndUpdate(id, user, {new: true,});

    if (!currentUser) return res.status(404).json({"message": "Not found"});

     user.avatarURL = file.path.replace('public', '');

     currentUser.avatarURL = user.avatarURL
    return await currentUser.save()    
}