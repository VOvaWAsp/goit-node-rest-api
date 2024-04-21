import path from "path"

import { addContact, Contact, getContactById, listContacts, removeContact, updateContactById } from "../services/contactsServices.js";
import { Types } from "mongoose";
import { queryParams } from "../helpers/midellwars.js";

export const getAllContacts = async(req, res, next) => {
    try {
        const userId = req.user.id;
        const query = await queryParams(req.query, userId);
        res.json(query);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res) => {
    const { id } = req.params;

    const valid = Types.ObjectId.isValid(id);

    if (!valid) return res.status(404).json({"message": "Not found"});

    const searchQuery = { _id: id, owner: req.user.id };

    const contact = await Contact.findOne(searchQuery);

    if (!contact) return res.status(404).json({"message": "Not found"});
    res.json(contact);
};

export const deleteContact = async(req, res) => {
    const { id } = req.params;

    const valid = Types.ObjectId.isValid(id);
    
    if (!valid) return res.status(404).json({"message": "Not found"});

    const searchQuery = { _id: id, owner: req.user.id };

    const contact = await Contact.findOne(searchQuery);

    if (!contact) return res.status(404).json({"message": "Not found"});

    const removeContacted = await Contact.findByIdAndDelete(contact);

    if (!removeContacted) return res.status(404).json({"message": "Not found"});
        
    res.json(removeContacted);
};

export const createContact = async(req, res) => {

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
};

export const updateContact = async(req, res) => {
const { id } = req.params;

const valid = Types.ObjectId.isValid(id);

if (!valid) return res.status(404).json({"message": "Not found"});

if (Object.keys(req.body).length === 0) {
    return res.status(400).json({"message": "Body must have at least one field"})
 }

 const searchQuery = { _id: id, owner: req.user.id };

 const contact = await Contact.findOne(searchQuery);

 if (!contact) return res.status(404).json({"message": "Not found"});

const updateContacts = await Contact.findByIdAndUpdate(contact, req.body, {new: true,});

if (!updateContacts) return res.status(404).json({"message": "Not found"});

return res.json(updateContacts);
};

export const updateStatusContact = async(req, res) => {
    const { id } = req.params;
    
    const valid = Types.ObjectId.isValid(id);
    
    if (!valid) return res.status(404).json({"message": "Not found"});

    const searchQuery = { _id: id, owner: req.user.id };

 const contact = await Contact.findOne(searchQuery);

 if (!contact) return res.status(404).json({"message": "Not found"});
    
    const updateFavorite = await Contact.findByIdAndUpdate(contact, req.body, {new: true,});

    if (!updateFavorite) return res.status(404).json({"message": "Not found"});
    
    return res.json(updateFavorite);
    };