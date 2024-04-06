import {promises as fs} from "fs"
import { nanoid } from "nanoid";
import path from "path"
import { model, Schema, Types } from "mongoose";

const contactsPath = path.join("db", "contacts.json");

export async function listContacts() {
        const getJson = await fs.readFile(contactsPath);
    return JSON.parse(getJson);
  }
  
  export async function getContactById(contactId) {
    const getJsonById = await listContacts();
    const find = getJsonById.find((item) => item.id === contactId)
    return find;
}
  
  export async function removeContact(contactId) {
    const removeJsonById = await fs.readFile(contactsPath);
    const get = JSON.parse(removeJsonById)
    const find = get.findIndex((item) => item.id === contactId)
    if (find === -1) {
       return null
    }
    const removed = get.splice(find, 1)[0];
    await fs.writeFile(contactsPath, JSON.stringify(get))
    return removed;
  }
  
  export async function addContact({name, email, phone}) {
    const addJsonById = await fs.readFile(contactsPath);
    const contacts = JSON.parse(addJsonById);
    const newContact = { id: nanoid(), name, email, phone };
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts));
        return newContact
  }

export async function updateContactById(id, {name, email, phone}) {
  const contact = await listContacts();
  const find = contact.findIndex((item) => item.id === id);
  if (find === -1) {
    return null;
  };
  if (name) {
    contact[find].name = name;
  }
  if (email) {
    contact[find].email = email;
  }
  if (phone) {
    contact[find].phone = phone;
  }
  await fs.writeFile(contactsPath, JSON.stringify(contact, null, 2));
  return contact[find];
}

const contactSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Set name for contact'],
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
},
{
  timestamps: true,
  versionKey: false,
})

export const Contact = model('Contact', contactSchema);