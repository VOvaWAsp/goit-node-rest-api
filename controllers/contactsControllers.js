import path from "path"
import {promises as fs} from "fs"
import { nanoid } from "nanoid";

import { createContactSchema, updateContactSchema } from "../schemas/contactsSchemas.js";
import { addContact, getContactById, listContacts, removeContact, updateContactById } from "../services/contactsServices.js";
import HttpError from "../helpers/HttpError.js";

const contactsPath = path.join("db", "contacts.json");

export const getAllContacts = async(req, res, next) => {
   const getUsers = await listContacts();
    res.json(getUsers);
};

export const getOneContact = async(req, res) => {
    const { id } = req.params;
    const getUser = await getContactById(id);
    
  if (!getUser) {
   res.status(404).json({"message": "Not found"})
    }
  res.json(getUser)
};

export const deleteContact = async(req, res) => {
    const { id } = req.params;
    const removeContacted = await removeContact(id);

    if (!removeContacted) {
        res.status(404).json({"message": "Not found"})
         }
       res.json(removeContacted)
};

export const createContact = async(req, res) => {
// const { value, errors } = createContactSchema.validate(req.body);
const createNewContcat = await addContact(req.body);

// const { name, email, phone }= value;

// try {
    // const addJsonById = await fs.readFile(contactsPath);
    // const contacts = JSON.parse(addJsonById);
    // const newContact = { id: nanoid(), name, email, phone };
    // contacts.push(newContact);
    // await fs.writeFile(contactsPath, JSON.stringify(contacts));

    res.status(201).json(createNewContcat);
// } catch (err) {
    //     console.error('Error creating contact:', err);
    //     res.status(500).json({ error: 'Server error' });
    // // }
};

export const updateContact = async(req, res) => {
const { id } = req.params;
if (Object.keys(req.body).length === 0) {
    res.status(400).json({"message": "Body must have at least one field"})
}
const updateContacts = await updateContactById(id, req.body);
if (!updateContacts) {
    res.status(404).json({"message": "Not found"})
            // res.status(400).json({"message": "Body must have at least one field"});
};

res.json(updateContacts);
};