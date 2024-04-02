import path from "path"

import { addContact, getContactById, listContacts, removeContact, updateContactById } from "../services/contactsServices.js";

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

const createNewContcat = await addContact(req.body);

    res.status(201).json(createNewContcat);
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