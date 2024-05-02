import jwt from 'jsonwebtoken';
import sgMail from '@sendgrid/mail'
import path from "path"
import pug from 'pug';
import { convert } from 'html-to-text';

import { User } from "../services/usersServices.js"
import { message, updateAvatarImage } from '../helpers/users.js';
import { Types } from 'mongoose';
import HttpError from '../helpers/HttpError.js';
import { registerUser } from '../helpers/midellwars.js';

export const registration = async(req, res, next) => {
  try { const { newUser } = await registerUser(req.body);
    if (newUser === undefined) throw HttpError(404, "Email is already in use"); 
    const { email, subscription, avatarURL } = newUser; 
    return res.status(201).json({
        user: {
            email,
            subscription,
            avatarURL
        }
    });
} catch(error) {
    next(error);
  }
}

export const login = async(req, res, next) => {
try {    const email = req.body.email
    const user = await User.findOne({email})

    if (!user) throw HttpError(404, "Email or password is wrong")

    if (user.verify === false) throw HttpError(404, "need verifed")

    const valid = req.body.password === user.password

    if (!valid)  throw HttpError(404, "Email or password is wrong")

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
    next(error);
  }
}

export const logout = async(req, res, next) => {
 try { const token = req.user
   token.token = null
   await token.save()
   res.sendStatus(204);
} catch(error) {
    next(error);
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
    next(error);
  }
}

export const updateSubscription = async(req, res, next) => {
  try { const { id } = req.user;
    
    const valid = Types.ObjectId.isValid(id);
    
    if (!valid) throw HttpError(404, "Not found")
    
    const updateSubscriptions = await User.findByIdAndUpdate(id, req.body, {new: true,});

    if (!updateSubscriptions) throw HttpError(404, "Not found")

    await updateSubscriptions.save();
    
    return res.json(updateSubscriptions);
} catch(error) {
    next(error);
  }
}

export const updateAvatar = async(req, res, next) => {
  try { const user = await updateAvatarImage(req.user, req.file);
    return res.json({
         user,
     }); 
    } catch(error) {
        next(error);
      }
}

export const verificationToken = async(req, res, next) => {
  try {
    const userId = await req.params.verificationToken;

  if (!userId) throw HttpError(404, 'User not found')

  const searchQuery = { verificationToken: userId };

  const contact = await User.findOne(searchQuery);

  if (!contact) throw HttpError(404,  'User not found')

  contact.verificationToken = "";
  contact.verify = true

  contact.save()

  res.json({"message": 'Verification successful'});
  } catch(error) {
    next(error)
  }
}

export const verify = async(req, res, next) => {
  try {
    const { email } = req.body

    if(!email) throw HttpError(400, "missing required field email")

    const contact = await User.findOne({email});

    if(contact.verify === true) throw HttpError(400, "Verification has already been passed")

    message(contact.id, contact.verificationToken, email)

  res.json({"message": "Verification email sent"})
  } catch(error) {
    next(error);
  }
}