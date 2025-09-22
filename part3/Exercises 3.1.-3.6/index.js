const express = require('express');
const app = express();
const persons = require('./models/person');


const generateId = () => {
  const maxId = persons.length > 0
    ? Math.max(...persons.map(n => Number(n.id)))
    : 0
  return String(maxId + 1)
}

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

app.post('/api/persons', express.json(), (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' });
  }
  const existingPerson = persons.find(p => p.name === name);
  if (existingPerson) {
    return res.status(400).json({ error: 'Name must be unique' });
  }
  const newPerson = {
    id: generateId(),
    name: name,
    number: number,
  };
  persons.push(newPerson);
  res.status(201).json(newPerson);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})