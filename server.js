const express = require('express');
const path = require('path');
const fs = require('fs');  
const uuid = require('./helpers/uuid');
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Read existing notes from JSON file
try {
    const data = fs.readFileSync('./db/notes.json', 'utf8');
    notes = JSON.parse(data);
} catch (err) {
    console.log('Error reading the file:', err);
    notes = [];
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'));
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'));
});

app.get('/api/notes', (req, res) => {
    res.json(notes);
});
//post routes
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    newNote.id = uuid();
    notes.push(newNote);
    
    fs.writeFileSync('./db/notes.json', JSON.stringify(notes));
    res.json(newNote);
});

app.get('/api/notes/:id', (req, res) => {
    const note = notes.find(n => n.id === req.params.id);
    if (note) {
        res.json(note);
    } else {
        res.status(404).send('Note not found');
    }
});

//add delete functionality
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
    const noteIndex = notes.findIndex(n => n.id === noteId);
  
    if (noteIndex === -1) {
      return res.status(404).send('Note not found');
    }
  
    // Remove the note from the array and write the updated array back to the JSON file
    notes.splice(noteIndex, 1);
    fs.writeFileSync('./db/notes.json', JSON.stringify(notes));
  
    res.status(200).send('Note deleted');
  });

app.listen(PORT, () => {
    console.log(`App listening on PORT: http://localhost:${PORT}`);
});