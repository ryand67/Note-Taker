const express = require('express');
const fs = require('fs');

const app = express();

const PORT = 8080;

app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

const notes = JSON.parse(fs.readFileSync(__dirname + '/db/db.json', 'utf-8', (err) => {
    if(err) throw err;
})) || [];

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
    notes.push(newNote);
    fs.writeFile(__dirname + '/db/db.json', JSON.stringify(notes, null, 2), (err) => {
        if(err) throw err;
    })
    res.end();
})

app.delete("/api/notes", (req, res) => {
    fs.writeFileSync(__dirname + '/db/db.json', [], (err) => {
        if(err) throw err;
    })
    res.end();
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})