const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
// instantiate the server
const app = express();

// tell server to listen for requests
const theNotes = require('/Develop/db/db.json');

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
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/notes.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/Develop/public/index.html'));
});

// function to create new note of user choice
function createFreshNote(body, notesArray) {
    const newNote = body;
    if (!Array.isArray(notesArray))
        notesArray = [];
    
    if (notesArray.length === 0)
        notesArray.push(0);

    body.id = notesArray[0];
    notesArray[0]++;

    notesArray.push(newNote);
    fs.writeFileSync(
        path.join(__dirname, './Develop/db/db.json'),
        JSON.stringify(notesArray, null, 2)
    );
    return freshNote;
}

// added post route to notes endpoint
app.post('/api/notes', (req, res) => {
    const freshNote = createFreshNote(req.body, theNotes);
    res.json(freshNote);
});

//function to remove note of user's choice
function removeNote(id, notesArray) {
    for (let i = 0; i < notesArray.length; i++) {
        let note = notesArray[i];

        if (note.id == id) {
            notesArray.splice(i, 1);
            fs.writeFileSync(
                path.join(__dirname, '/Develop/db/db.json'),
                JSON.stringify(notesArray, null, 2)
            );

            break;
        }
    }
}

app.delete('/api/notes/:id', (req, res) => {
    removeNote(req.params.id, theNotes);
    res.json(true);
});


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });


