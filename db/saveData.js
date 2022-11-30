const util = require('util');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid'); 

const readNote = util.promisify(fs.readFile);
const writeNote = util.promisify(fs.writeFile);
// save note
class Save {
    // write note which returns writenote function
    write(note) {
        return writeNote('db/db.json', JSON.stringify(note));
    }

    // read note which returns readnote function
    read() {
        return readNote('db/db.json', 'utf8');
    }

    // retrieve notes 
    retrieveNotes() {
        return this.read().then(notes => {
            let parsedNotes;
            try {
                parsedNotes = [].concat(JSON.parse(notes));
            } catch (err) {
                parsedNotes = [];
            }
            return parsedNotes;
        });
    }

    // add notes function that consists of title and text and will throw an error if left blank
    addNote(note) {
        const { title, text } = note;
        if (!title || !text) {
            throw new Error('Both title and text can not be blank');
        }
        // To add unique IDs, use the UUID package.
        const newNote = { title, text, id: uuidv4() };

        // Retrieve, update, and create new notes.
        return this.retrieveNotes()
            .then(notes => [...notes, newNote])
            .then(updatedNotes => this.write(updatedNotes))
            .then(() => newNote);
    }

    // Function to remove note
    deleteNote(id) {
        return this.retrieveNotes()
            .then(notes => notes.filter(note => note.id !== id))
            .then(filteredNotes => this.write(filteredNotes));
    }
}

module.exports = new Save();