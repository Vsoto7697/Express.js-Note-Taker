const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
// instantiate the server
const app = express();

// tell server to listen for requests
const theNotes = require('./db/db.json');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));

//handle requests for notes
app.get('/api/notes', (req, res) => {
    res.json(theNotes.slice(1));
});

// create routes to serve index.html and notes.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

// function to create new note of user choice
function createFreshNote(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, '../db/db.json'),
        JSON.stringify({
            notes: notesArray
        }, null, 2)
    )

    return note;
}

//function to remove note of user's choice
function removeNote(id, notesArray) {
    let deleteID = parseInt(id);
    notesArray.splice(deleteID, 1);

    // The remaining notes' indexes are rewritten in this loop.
    for (let i = deleteID; i < notesArray.length; i++) {
        notesArray[i].id = i.toString();
    }

    fs.writeFileSync(
        path.join(__dirname, '../db/db.json'),
        JSON.stringify({
            notes: notesArray
        }, null, 2)
    )
}


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });

  module.exports = {
    createFreshNote,
    removeNote
};
