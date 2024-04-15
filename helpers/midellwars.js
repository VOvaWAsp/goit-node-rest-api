import jwt from "jsonwebtoken"
import { User } from "../services/usersServices.js";
import { Contact } from "../services/contactsServices.js";
import HttpError from "./HttpError.js";

export const tokens = (token) => {
    try {
        const { id } = jwt.verify(token, process.env.SECRET);
        return id;
    } catch (error) {
        console.error({ message: 'Unauthorized' });
    }
}

export const verifyToken = async(req, res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
    const id = await tokens(token);

    if (!id) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const currentUser = await User.findById(id);

        if (!currentUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
}

export const queryParams = async(query, contact) => {
    const queryParams = query.favorite === 'true' ? Contact.find({favorite: true}) : Contact.find()
    console.log(query)
    const page = query.page ? +query.page : 1;
    const limit = query.limit ? +query.limit : 20;
    const skip = ( page - 1 ) * limit;

    queryParams.skip(skip).limit(limit);

    const querys = await queryParams;
    return querys;
}