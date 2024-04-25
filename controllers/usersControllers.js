import jwt from 'jsonwebtoken';

import { User } from "../services/usersServices.js"
import { registerUser, updateAvatarImage } from '../helpers/users.js';
import { Types } from 'mongoose';

export const registration = async(req, res) => {
    const { newUser } = await registerUser(req.body);
    console.log(req.body)
    console.log(newUser)
    if (newUser === undefined) return res.status(404).json({ "message": "Email is already in use" })
    const { email, subscription, avatarURL } = newUser; 
    return res.status(201).json({
        user: {
            email,
            subscription,
            avatarURL
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
   res.sendStatus(204);
}

export const current = async(req, res) => {
    const currentUser = req.user;
    const { email, subscription } = currentUser
   return res.json({
    email,
    subscription
   })
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

export const updateAvatar = async(req, res) => {
    const user = await updateAvatarImage(req.user, req.file);
   return res.json({
        user,
    });
  
}
