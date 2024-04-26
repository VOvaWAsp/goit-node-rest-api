import jwt from "jsonwebtoken"
import { User } from "../services/usersServices.js";
import { Contact } from "../services/contactsServices.js";
import HttpError from "./HttpError.js";
import multer from "multer";
import path from "path"
import Jimp from "jimp";


// export const tokens = (token) => {
//     try {
//         const id = jwt.verify(token, process.env.SECRET);
//         return id;
//     } catch (error) {
//         console.error({ message: 'Unauthorized' });
//     }
// }

// export const verifyToken = async(req, res, next) => {
//     const token = await
//     req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.split(' ')[1];
//     const {id} = await tokens(token);

//     console.log(id)

//     if (!id) {
//         return res.status(401).json({ message: 'Unauthorized1' });
//     }
//         const currentUser = await User.findById(id);

//         if (!currentUser) {
//             return res.status(401).json({ message: 'Unauthorized2' });
//         }

//         req.user = currentUser;
//         next();
// }

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

        console.log(id)

        if (token === '') return res.status(401).json({ message: 'Not authorized' });

        if (!id) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        
        const currentUser = await User.findById(id);

        if (!currentUser) {
            return res.status(401).json({ message: 'Unauthorized' });
        }


        if (currentUser.token === null) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        req.user = currentUser;
        next();
    } catch (error) {
        console.error('Unauthorized');
        return res.status(401).json({ message: 'Not authorized' });
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
        Jimp.read(`${req.user.id}.${name}`, (err, lenna) => {
            if (err) return err;
            lenna
              .resize(256, 256) // resize
              .greyscale() // set greyscale
              .write("lena-small-bw.jpg"); // save
          });
        cbl(null, `${req.user.id}.${name}`);
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
