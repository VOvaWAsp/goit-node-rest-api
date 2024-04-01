import path from "path"
import {promises as fs} from "fs"
import { nanoid } from "nanoid";

import { createContactSchema, updateContactSchema } from "../schemas/ contactsSchemas.js";
import { getContactById, listContacts, removeContact } from "../services/ contactsServices.js";
import validateBody from "../helpers/validateBody.js";
import HttpError from "../helpers/HttpError.js";
// import contactsService from "../services/contactsServices.js";

const contactsPath = path.join("db", "contacts.json");

export const getAllContacts = async(req, res) => {
    const getUsers = await listContacts();
    res.status(200).json({
        msg: 'success',
        users: getUsers,
    })
};

export const getOneContact = async(req, res) => {
    const { id } = req.params;
    const getUser = await getContactById(id);
    
    HttpError(404, {message: "Not found"})

    res.status(200).json({
        msg: 'success',
        users: getUser,
    })};

export const deleteContact = async(req, res) => {
    const { id } = req.params;
    const removeContacted = await removeContact(id);

    HttpError(404, {message: "Not found"});

    res.status(200).json({
        msg: "success",
        user: removeContacted
    })
};

export const createContact = async(req, res) => {
const { value, errors } = createContactSchema.validate(req.body);

if (errors) {
    validateBody(errors);
};

const { name, email, phone }= value;

try {
    const addJsonById = await fs.readFile(contactsPath);
    const contacts = JSON.parse(addJsonById);
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));

    res.status(201).json({
        msg: "success",
        user: newContact,
    });
} catch (err) {
        console.error('Error creating contact:', err);
        res.status(500).json({ error: 'Server error' });
    }
};

export const updateContact = async(req, res) => {
    const { id } = req.params;
    const { value, errors } = updateContactSchema.validate(req.body);

    if (errors) {
        HttpError(400, {"message": "Body must have at least one field"});
    }

    const { name, email, phone } = value;

    try {
    const updateJsonById = await fs.readFile(contactsPath);
    const get = JSON.parse(updateJsonById)
    const find = get.filter((item) => item.id === id)
    if (!find) {
       return null
    }
    const update = { ...get[find], id, name, email, phone}
    await fs.writeFile(contactsPath, JSON.stringify(get))
    res.status(200).json({
        msg: "success",
        users: update,
    })
} catch (err) {
    console.error('Error creating contact:', err);
    res.status(500).json({ error: 'Server error' });
}
};