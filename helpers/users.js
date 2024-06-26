// import jwt from "jsonwebtoken";
import gravatar from "gravatar"
import path from "path"
import Jimp from "jimp";
import { v4 } from 'uuid';

import { User } from "../services/usersServices.js";
import HttpError from "./HttpError.js";
import { Types } from "mongoose";

export const registerUser = async (user) => {
    const { email } = user;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw HttpError(409, "Email is already in use" );
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
    const id = user.id;
    const name = file.mimetype.split('/')[1];

        const lenna = await Jimp.read(file.path);
        await lenna.resize(250, 250).write(`${id}${v4()}.${name}`)

        user.avatarURL = file.path.replace('public', '');

        const currentUser = await User.findByIdAndUpdate(id, user, { new: true });

        return currentUser;
}