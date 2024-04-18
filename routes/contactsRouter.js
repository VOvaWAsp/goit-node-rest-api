import express from "express";
import {
  getAllContacts,
  getOneContact,
  deleteContact,
  createContact,
  updateContact,
  updateStatusContact,
} from "../controllers/contactsControllers.js";
import { createContactSchema, updateContactSchema, updateFavoriteSchema } from "../schemas/contactsSchemas.js";
import validateBody from "../helpers/validateBody.js";
import { verifyToken } from "../helpers/midellwars.js";

const contactsRouter = express.Router();

contactsRouter.use(verifyToken)
contactsRouter.get("/",verifyToken, getAllContacts);

contactsRouter.get("/:id",verifyToken, getOneContact);

contactsRouter.delete("/:id",verifyToken, deleteContact);

contactsRouter.post("/",verifyToken, validateBody(createContactSchema), createContact);

contactsRouter.put("/:id",verifyToken, validateBody(updateContactSchema), updateContact);

contactsRouter.patch("/:id/favorite",verifyToken, validateBody(updateFavoriteSchema), updateStatusContact);

export default contactsRouter;