//Required modules
const express = require('express');
const fs = require('fs');

const app = express();

const PORT = 8080;

//Middleware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

//Read the db file and set it to notes variable
let notes = fs.readFileSync(__dirname + '/db/db.json', 'utf-8', (err) => {
    if(err) {
        return;
    }
})

//Either set notes to an empty array or parse the file that was read
if(notes === "") {
    notes = [];
} else {
    notes = JSON.parse(notes);
}

//Send the home page on path /
app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

//Send the notes page on path /notes
app.get("/notes", (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
})

//Returns json data of the notes array on path get /api/notes
app.get("/api/notes", (req, res) => {
    return res.json(notes);
})

//When a new note gets sent in
app.post("/api/notes", (req, res) => {
    //Store the note in this variable
    let newNote = req.body;
    //Set the id of the note to the length of the array + 1 (so the first one has id 1)
    newNote.id = notes.length + 1;
    //Push the new note
    notes.push(newNote);
    //Write a new file with the newly updated array
    fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes, null, 2), (err) => {
        if(err) throw err;
    })
    //End the response
    res.end();
})

//On delete at path /api/notes/:id
app.delete("/api/notes/:id", (req, res) => {
    //Save the id in a variable
    let id = req.params.id;
    //Remove the note from the array
    notes.splice(id - 1, 1);
    //Cycle through the array and reassign id's
    for(let i = 0; i < notes.length; i++) {
        notes[i].id = i + 1;
    }
    //Write a new file with the updated array
    fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes, null, 2), (err) => {
        if(err) throw err;
    })
    //End the response
    res.end();
})

//Start the server listening
app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})