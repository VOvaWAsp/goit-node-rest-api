import jwt from "jsonwebtoken"
import { User } from "../services/usersServices.js";
import { Contact } from "../services/contactsServices.js";
import HttpError from "./HttpError.js";
import multer from "multer";
import path from "path"
import { v4 } from "uuid";
import { message } from "./users.js";
import sgMail from '@sendgrid/mail'
import pug from "pug"
import { convert } from 'html-to-text';
import gravatar from "gravatar"

export const tokens = (token, res) => {
    try {
        const id = jwt.verify(token, process.env.SECRET);
        return id;
    } catch (error) {
        console.error({ message: 'Unauthorized' });
    }
}

export const verifyToken = async(req, res, next) => {
    try {
        const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
        const { id } = await tokens(token);
        
        const currentUser = await User.findById(id);

        req.user = currentUser;
        next();
    } catch (error) {
        next(error)
    }
}


export const queryParams = async (query, id) => {
    const favoriteContacts = query.favorite === 'true';

    const searchQuery = { owner: id };

    if (favoriteContacts) {
        searchQuery.favorite = true;
    }

    const page = query.page ? +query.page : 1;
    const limit = query.limit ? +query.limit : 20;
    const skip = (page - 1) * limit;

    const queryResult = await Contact.find(searchQuery).skip(skip).limit(limit);

    return queryResult;
};

const storage = multer.diskStorage({
    destination: (req, file, cbl) => {
        cbl(null, path.join('public', 'avatars'))
    },
    filename: (req, file, cbl) => {
        const name = file.mimetype.split('/')[1];
        cbl(null, `${req.user.id}${v4()}.${name}`);
    }});

const filter = (req, file, cbl) => {
    if (file.mimetype.startsWith('image/')) {
        cbl(null, true);
    } else {
            cbk(console.log(400, 'Please, upload images only..'), false);
          }        
}

export const uploadAvatars = multer({
    storage: storage,
    fileFilter: filter,
    limits: {
        fieldNameSize: 2 * 1024 * 1024,
    }
}).single('avatar')

export const registerUser = async (user) => {
    const { email } = user;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw HttpError(409, "Email is already in use" );
    }

    user.verificationToken = v4();


    const newUser = await User.create({ ...user });

  message(newUser.id, newUser.verificationToken, email)

    // const id = newUser.id;
    // const token = jwt.sign({ id }, process.env.SECRET, { expiresIn: "1h" });
    // newUser.token = token;

    newUser.avatarURL = gravatar.url(email, {s: '200', r: 'pg', d: '404'});

    await newUser.save();

    newUser.password = undefined;
    return { newUser };
};