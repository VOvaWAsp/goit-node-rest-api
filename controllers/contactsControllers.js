import path from "path"

import { addContact, Contact, getContactById, listContacts, removeContact, updateContactById } from "../services/contactsServices.js";
import { Types } from "mongoose";
import { queryParams } from "../helpers/midellwars.js";
import HttpError from "../helpers/HttpError.js";

export const getAllContacts = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const query = await queryParams(req.query, userId);
        res.json(query);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
  try { const { id } = req.params;

    const valid = Types.ObjectId.isValid(id);

    if (!valid) throw HttpError(404, "Not found")

    const searchQuery = { _id: id, owner: req.user.id };

    const contact = await Contact.findOne(searchQuery);

    if (!contact) throw HttpError(404,  "Not found")
    res.json(contact);
} catch(error) {
    next(error);
  }
};

export const deleteContact = async(req, res, next) => {
try {   const { id } = req.params;

    const valid = Types.ObjectId.isValid(id);
    
    if (!valid)  throw HttpError(404, "Not found")

    const searchQuery = { _id: id, owner: req.user.id };

    const contact = await Contact.findOne(searchQuery);

    if (!contact)  throw HttpError(404, "Not found")

    const removeContacted = await Contact.findByIdAndDelete(contact);

    if (!removeContacted)  throw HttpError(404, "Not found")
        
    res.json(removeContacted);
} catch(error) {
    next(error);
  }
};

export const createContact = async(req, res, next) => {
try {
    const createNewContcat = await Contact.create(req.body);

const { name, email, phone, favorite, owner } = createNewContcat
const owners = req.user;
const ownered = owners.id;

createNewContcat.owner = ownered;

createNewContcat.save();

    res.status(201).json({
        name,
        email,
        phone,
        favorite,
        ownered,
    });
} catch(error) {
    next(error);
  }
};

export const updateContact = async(req, res, next) => {
try { 
const { id } = req.params;

const valid = Types.ObjectId.isValid(id);

if (!valid)  throw HttpError(404, "Not found")

if (Object.keys(req.body).length === 0) {
    throw HttpError(400, "Body must have at least one field")
 }

 const searchQuery = { _id: id, owner: req.user.id };

 const contact = await Contact.findOne(searchQuery);

 if (!contact) throw HttpError(404, "Not found")

const updateContacts = await Contact.findByIdAndUpdate(contact, req.body, {new: true,});

if (!updateContacts) throw HttpError(404, "Not found")

return res.json(updateContacts);
} catch(error) {
    next(error);
  }
};

export const updateStatusContact = async(req, res, next) => {
 try {  const { id } = req.params;
    
    const valid = Types.ObjectId.isValid(id);
    
    if (!valid) throw HttpError(404, "Not found")

    const searchQuery = { _id: id, owner: req.user.id };

 const contact = await Contact.findOne(searchQuery);

 if (!contact) throw HttpError(404, "Not found")
    
    const updateFavorite = await Contact.findByIdAndUpdate(contact, req.body, {new: true,});

    if (!updateFavorite) throw HttpError(404, "Not found")
    
    return res.json(updateFavorite);
} catch(error) {
    next(error);
  }
    };