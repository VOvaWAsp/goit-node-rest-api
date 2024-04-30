import express from "express"
import { current, login, logout, registration, updateAvatar, updateSubscription } from "../controllers/usersControllers.js";
import { uploadAvatars, verifyToken } from "../helpers/midellwars.js";
import validateBody from "../helpers/validateBody.js";
import { updateSubscriptionSchema, usersSchema } from "../schemas/contactsSchemas.js";

const usersRouter = express.Router();

usersRouter.post('/register', validateBody(usersSchema), registration)
usersRouter.post('/login', validateBody(usersSchema), login)
usersRouter.post('/logout', verifyToken, logout)
usersRouter.get('/current', verifyToken, current)
usersRouter.patch('/', validateBody(updateSubscriptionSchema), verifyToken, updateSubscription)
usersRouter.patch('/avatars',verifyToken, uploadAvatars, updateAvatar);

export default usersRouter;