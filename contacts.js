const fs = require('fs').promises
const path = require('path')
const contactsPath = path.join('./db/contacts.json');
const shortId = require('shortid');

// fs.readFile(filename, [options]) - чтение файла
// fs.writeFile(filename, data, [options]) - запись файла

// TODO: задокументировать каждую функцию
const listContacts = () => {
    fs.readFile(contactsPath)
        .then((data) =>  (!data) ? process.exit(1) : console.table(JSON.parse(data.toString())))
        .catch((error) => console.log(error.message))
}

const getContactById = (contactId) => {
    fs.readFile(contactsPath)
        .then((data) => {
            if (!data)
                process.exit(1);
            const contacts = JSON.parse(data.toString());
            const findContact = contacts.find(({ id }) => id == contactId);
            if (!findContact)
                process.exit(1);
            console.table([findContact]);
        })
        .catch((error) => console.log(error.message))
}

const removeContact = (contactId) => {
    fs.readFile(contactsPath)
        .then((data) => {
            if (!data)
                process.exit(1);
            const contacts = JSON.parse(data.toString());
            const filterContacts = contacts.filter(({ id }) => id != contactId);
            if (contacts.length !== filterContacts.length) {
                fs.writeFile(contactsPath, JSON.stringify(filterContacts))
                    .then(console.log(`Contact with id=${contactId} was deleted successfully.`))
                    .catch((error) => console.log(error.message))
            }
            listContacts();
        })
        .catch((error) => console.log(error.message))
}

const addContact = (name, email, phone) => {
    fs.readFile(contactsPath)
        .then((data) => {
            if (!data)
                process.exit(1);
            const contacts = JSON.parse(data.toString());
            if (name && email && phone) {
                const id = shortId.generate();
                contacts.push({ id, name, email, phone });
                fs.writeFile(contactsPath, JSON.stringify(contacts))
                    .then(() => {
                        console.table(contacts);
                        console.log(`Contact ${name} was added successfully.`);
                    })   
                    .catch((error) => console.log(error.message))
            }
        })
        .catch((error) => console.log(error.message))
}

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
}