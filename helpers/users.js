// import jwt from "jsonwebtoken";
import gravatar from "gravatar"
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

export const registerUser = async (user) => {
    const { email } = user;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw HttpError(409, "Email is already in use" );
    }

    user.verificationToken = v4();

//   try {
//     // 1. setup email sendig transport
//     const emailTransport = nodemailer.createTransport({
//         host: "sandbox.smtp.mailtrap.io",
//         port: 2525,
//         auth: {
//           user: "c31c155070852a",
//           pass: "05406f784fcf70"
//         }
//       });
//     // 2. config email
//     const emailConfig = {
//       from: 'Todos app admin <admin@example.com>',
//       to: 'test@example.com',
//       subject: 'Password reset testing',
//       html: `/users/verify/${user.verificationToken}`,
//       text: 'Test email (text version)',
//     };
    // 3. send email
//     await emailTransport.sendMail(emailConfig);
//   } catch (err) {
//     throw HttpError(404, "...")
//   }


    const newUser = await User.create({ ...user });

    const html = pug.renderFile(path.join(process.cwd(), "confirmEmail", "confirmEmail.pug"), {
        name: newUser.id,
        token: newUser.verificationToken
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