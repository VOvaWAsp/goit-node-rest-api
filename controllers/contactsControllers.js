import path from "path"

import { addContact, Contact, getContactById, listContacts, removeContact, updateContactById } from "../services/contactsServices.js";
import { Types } from "mongoose";
import { queryParams } from "../helpers/midellwars.js";

export const getAllContacts = async(req, res, next) => {
    // const contacts = await Contact.find();
    const query = await queryParams(req.query, req.user);
    res.json(query);
};

export const getOneContact = async(req, res) => {
const { id } = req.params;

const valid = Types.ObjectId.isValid(id);

if (!valid) return res.status(404).json({"message": "Not found"});

const contact = await Contact.findById(id);

if (!contact) return res.status(404).json({"message": "Not found"});
res.json(contact);
};

export const deleteContact = async(req, res) => {
    const { id } = req.params;

    const valid = Types.ObjectId.isValid(id);
    
    if (!valid) return res.status(404).json({"message": "Not found"});

    const removeContacted = await Contact.findByIdAndDelete(id);

    if (!removeContacted) return res.status(404).json({"message": "Not found"});
        
    res.json(removeContacted);
};

export const createContact = async(req, res) => {

const createNewContcat = await Contact.create(req.body);

    res.status(201).json(createNewContcat);
};

export const updateContact = async(req, res) => {
const { id } = req.params;

const valid = Types.ObjectId.isValid(id);

if (!valid) return res.status(404).json({"message": "Not found"});

if (Object.keys(req.body).length === 0) {
    return res.status(400).json({"message": "Body must have at least one field"})
 }

const updateContacts = await Contact.findByIdAndUpdate(id, req.body, {new: true,});

if (!updateContacts) return res.status(404).json({"message": "Not found"});

return res.json(updateContacts);
};

export const updateStatusContact = async(req, res) => {
    const { id } = req.params;
    
    const valid = Types.ObjectId.isValid(id);
    
    if (!valid) return res.status(404).json({"message": "Not found"});
    
    const updateFavorite = await Contact.findByIdAndUpdate(id, req.body, {new: true,});

    if (!updateFavorite) return res.status(404).json({"message": "Not found"});
    
    return res.json(updateFavorite);
    };