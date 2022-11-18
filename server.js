const PORT = process.env.PORT || 3001;
const fs = require('fs');
const path = require('path');

const express = require('express');
// instantiate the server
const app = express();

const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));

// parse incoming JSON data
app.use(express.json());
app.use(express.static('public'));
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

// function to create new note of user choice
function createFreshNote(body, notesArray) {
    const note = body;
    notesArray.push(note);

    fs.writeFileSync(
        path.join(__dirname, './db/db.json'),
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
        path.join(__dirname, './db/db.json'),
        JSON.stringify({
            notes: notesArray
        }, null, 2)
    )
}


app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
  });
