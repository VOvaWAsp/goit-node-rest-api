import multer from "multer";
import path from "path"
import Jimp from "jimp";

const storage = multer.diskStorage({
    destination: (req, file, cbl) => {
        cbl(null, path.join('public', 'avatars'))
    },
    filename: (req, file, cbl) => {
        const name = file.mimetype.split('/')[1];
        cbl(null, `${req.user.id}.${name}`);
Jimp.read(`${req.user.id}.${name}`)
.then((lenna) => {
  return lenna
    .resize(250, 250) // resize
    .greyscale() // set greyscale
    .write("public", 'avatars'); // save
})
.catch((err) => {
  console.error(err);
});
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
