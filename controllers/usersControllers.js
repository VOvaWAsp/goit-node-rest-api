import jwt from 'jsonwebtoken';

import { User } from "../services/usersServices.js"
import { registerUser } from '../helpers/users.js';
import { Types } from 'mongoose';

export const registration = async(req, res) => {
    const { newUser, token } = await registerUser(req.body);
    const { email, subscription } = newUser;
    const valid = await User.findOne(newUser.email);
    if (!valid.keyValue)  return res.status(404).json({"message": "Email in use"});
    return res.status(201).json({
        user: {
            email,
            subscription
        }
    });
}

export const login = async(req, res) => {
    const email = req.body.email
    const user = await User.findOne({email})

    if (!user) return res.status(404).json({"message": "Email or password is wrong"});

    const valid = req.body.password === user.password

    if (!valid) return res.status(404).json({"message": "Email or password is wrong"});

    const id = user.id
    const token = jwt.sign({id}, process.env.SECRET, {expiresIn: "1h"});
    user.token = token

    await user.save();

    const { subscription } = user;

    user.password = undefined;
    res.status(201).json(({
        token,
        user: {
            email,
            subscription
        }
    }))
}

export const logout = async(req, res) => {
   const token = req.user
   token.token = null
   await token.save()
   res.json(token)
}

export const current = async(req, res) => {
    const currentUser = req.user;
   return res.json(currentUser)
}

export const updateSubscription = async(req, res) => {
    const { id } = req.user;
    
    const valid = Types.ObjectId.isValid(id);
    
    if (!valid) return res.status(404).json({"message": "Not found"});
    
    const updateSubscriptions = await User.findByIdAndUpdate(id, req.body, {new: true,});

    if (!updateSubscriptions) return res.status(404).json({"message": "Not found"});

    await updateSubscriptions.save();
    
    return res.json(updateSubscriptions);
}