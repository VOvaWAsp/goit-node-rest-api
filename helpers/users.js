// import jwt from "jsonwebtoken";
import path from "path"
import Jimp from "jimp";
import { v4 } from 'uuid';
import nodemailer from "nodemailer"
import sgMail from '@sendgrid/mail'
import pug from "pug"
import { convert } from 'html-to-text';

import { User } from "../services/usersServices.js";
import HttpError from "./HttpError.js";
import { Types } from "mongoose";

export const message = (name, tokens, email) => {
    const html = pug.renderFile(path.join(process.cwd(), "confirmEmail", "confirmEmail.pug"), {
                name: name,
                token: tokens
              });
        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY)
        const msg = {
          to: email, // Change to your recipient
          from: 'brainaxin@gmail.com', // Change to your verified sender
          subject: 'Sending with SendGrid is Fun',
          text: convert(html),
          html: html,
        }
        sgMail
          .send(msg)
          .then(() => {
            console.log('Email sent')
          })
          .catch((error) => {
            console.error(error)
          })
}

export const updateAvatarImage = async(user, file) => {
    const id = user.id;
    const name = file.mimetype.split('/')[1];

        const lenna = await Jimp.read(file.path);
        await lenna.resize(250, 250).write(`${id}${v4()}.${name}`)

        user.avatarURL = file.path.replace('public', '');

        const currentUser = await User.findByIdAndUpdate(id, user, { new: true });

        return currentUser;
}