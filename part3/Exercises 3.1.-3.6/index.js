const express = require('express');
const app = express();
const persons = require('./models/person');

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

app.get('/info', (req, res) => {
  const personCoiunt = persons.length;
  const date = new Date();
  res.send(`<p>Phonebook has info for ${personCoiunt} people</p><p>${date}</p>`);
});
 
app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const person = persons.find(p => p.id === id);
  if (person) {
    res.json(person);
  } else {
    res.status(404).end();
  }
});

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  const personIndex = persons.findIndex(p => p.id === id);
  if (personIndex !== -1) {
    persons.splice(personIndex, 1);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})