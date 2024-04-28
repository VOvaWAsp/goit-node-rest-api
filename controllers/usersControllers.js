import jwt from 'jsonwebtoken';

import { User } from "../services/usersServices.js"
import { registerUser, updateAvatarImage } from '../helpers/users.js';
import { Types } from 'mongoose';
import HttpError from '../helpers/HttpError.js';

export const registration = async(req, res, next) => {
  try { const { newUser } = await registerUser(req.body);
    if (newUser === undefined) throw new HttpError(404, { "message": "Email is already in use"}); 
    const { email, subscription, avatarURL } = newUser; 
    return res.status(201).json({
        user: {
            email,
            subscription,
            avatarURL
        }
    });
} catch(error) {
    next();
  }
}

export const login = async(req, res, next) => {
try {    const email = req.body.email
    const user = await User.findOne({email})

    if (!user) throw new HttpError(404, {"message": "Email or password is wrong"})

    const valid = req.body.password === user.password

    if (!valid)  throw new HttpError(404, {"message": "Email or password is wrong"})

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
} catch(error) {
    next();
  }
}

export const logout = async(req, res, next) => {
 try { const token = req.user
   token.token = null
   await token.save()
   res.sendStatus(204);
} catch(error) {
    next();
  }
}

export const current = async(req, res, next) => {
  try { const currentUser = req.user;
    const { email, subscription } = currentUser
   return res.json({
    email,
    subscription
   })
} catch(error) {
    next();
  }
}

export const updateSubscription = async(req, res, next) => {
  try { const { id } = req.user;
    
    const valid = Types.ObjectId.isValid(id);
    
    if (!valid) throw new HttpError(404, {"message": "Not found"})
    
    const updateSubscriptions = await User.findByIdAndUpdate(id, req.body, {new: true,});

    if (!updateSubscriptions) throw new HttpError(404, {"message": "Not found"})

    await updateSubscriptions.save();
    
    return res.json(updateSubscriptions);
} catch(error) {
    next();
  }
}

export const updateAvatar = async(req, res, next) => {
  try { const user = await updateAvatarImage(req.user, req.file);
    return res.json({
         user,
     }); 
    } catch(error) {
        next();
      }
}
