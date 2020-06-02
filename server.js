const express = require('express');
const fs = require('fs');

const app = express();

const PORT = 8080;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

let notes = fs.readFileSync(__dirname + '/db/db.json', 'utf-8', (err) => {
    if(err) {
        return;
    }
})

if(notes === "") {
    notes = [];
} else {
    notes = JSON.parse(notes);
}


app.get("/", (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
})

app.get("/notes", (req, res) => {
    res.sendFile(__dirname + '/public/notes.html');
})

app.get("/api/notes", (req, res) => {
    return res.json(notes);
})

app.post("/api/notes", (req, res) => {
    let newNote = req.body;
    newNote.id = notes.length + 1;
    notes.push(newNote);
    fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes, null, 2), (err) => {
        if(err) throw err;
    })
    res.end();
})

app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id;
    notes.splice(id - 1, 1);
    for(let i = 0; i < notes.length; i++) {
        notes[i].id = i + 1;
    }
    fs.writeFileSync(__dirname + '/db/db.json', JSON.stringify(notes, null, 2), (err) => {
        if(err) throw err;
    })
    res.end();
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})