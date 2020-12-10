const express = require('express');
// dependencies (these are needed for this to work)
const fs = require('fs');
const util = require('util');
const path = require ('path');
const { v4: uuidv4 } = require('uuid');

// asynchronous processes
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

// express server
const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// middleware - static
app.use(express.static('public'));

// HTML GET
app.get('/', (req, res) => {
    res.sendFile(path.join(_dirname, 'public', 'index.html'));
});

// Notes GET
app.get('/notes', (req, res) => {
    res.sendFile(path.join(_dirname, 'public', 'notes.html'));
});

// API routes GET
app.get('/api/notes', (req, res) => {
    readFile('./db/db.json', 'utf8')
    .then((data) => {
        const notes = JSON.parse(data);
        res.json(notes);
    })
    .catch((err) => console.log(err));
});

// Notes object POST
app.post('/api/notes', async (req, res) => {
    let notes = await readFile('./db/db.json', 'utf8');
    notes = JSON.parse(notes);
    req.body.id = uuidv4();
    notes.push(req.body);

    await writeFile('./db/db.json', JSON.stringify(notes));
    res.json(notes[notes.length - 1]);
});

// Deleting items based on ID DELETE
app.delete('/api/notes/:id', async (req, res) => {
    const id = req.params.id;

    let notes = await readFile('./db/db.json', 'utf8');
    notes = JSON.parse(notes);
    notes = notes.filter((note) => note.id !== id);
    await writeFile('./db/db.json', JSON.stringify(notes));
    res.json(notes);
});

// Listening
app.listen(PORT, () => {
    console.log(`Server listening at PORT: ${PORT}`);
});
