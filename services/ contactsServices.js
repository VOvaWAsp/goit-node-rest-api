import {promises as fs} from "fs"
import path from "path"

const contactsPath = path.join("db", "contacts.json");

export async function listContacts() {
        const getJson = await fs.readFile(contactsPath);
    return JSON.parse(getJson);
  }
  
  export async function getContactById(contactId) {
    const getJsonById = await fs.readFile(contactsPath)
    const get = JSON.parse(getJsonById)
    const find = get.find((item) => item.id === contactId)
    if (!find) {
       return null
    }
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
  
//   export async function addContact(name, email, phone) {
//         const addJsonById = await fs.readFile(contactsPath);
//         const get = JSON.parse(addJsonById)
//         const addJson = {id: nanoid(), name, email, phone};
//         const updateJson = [...get, addJson];
//         await fs.writeFile(contactsPath, JSON.stringify(updateJson))
//         return addJson
//   }

