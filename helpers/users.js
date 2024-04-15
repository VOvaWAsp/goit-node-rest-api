import jwt from "jsonwebtoken";
import { User } from "../services/usersServices.js";

export const registerUser = async(user) => {
    const newUser = await User.create({
        ...user
    })
    const id = newUser.id
    const token = jwt.sign({id}, process.env.SECRET, {expiresIn: "1h"});
    newUser.token = token
    console.log(newUser)
    await newUser.save()
    newUser.password = undefined;
    return { newUser, token }
}