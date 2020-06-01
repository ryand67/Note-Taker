const express = require('express');
const fs = require('fs');

const app = express();

const PORT = 8080;

app.get("/", (req, res) => {
    let page = fs.readFileSync(__dirname + "/public/index.html", (err) => {
        if(err) throw err;
    })
    res.end(page);
})

app.get("/notes", (req, res) => {
    let page = fs.readFileSync(__dirname + "/public/notes.html", (err) => {
        if(err) throw err;
    })
    res.end(page);
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
})