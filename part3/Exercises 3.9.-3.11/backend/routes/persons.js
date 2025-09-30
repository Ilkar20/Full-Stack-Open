const express = require('express');
const router = express.Router();
const persons = require('../models/person');
const generateId = require('../utils/generateId');

// GET all persons
router.get('/', (req, res) => {
  res.json(persons);
});

// GET person by id
router.get('/:id', (req, res) => {
  const person = persons.find(p => p.id === req.params.id);
  if (person) res.json(person);
  else res.status(404).end();
});

// DELETE person
router.delete('/:id', (req, res) => {
  const index = persons.findIndex(p => p.id === req.params.id);
  if (index !== -1) {
    persons.splice(index, 1);
    res.status(204).end();
  } else {
    res.status(404).end();
  }
});

// POST new person
router.post('/', (req, res) => {
  const { name, number } = req.body;
  if (!name || !number) return res.status(400).json({ error: 'Name or number is missing' });

  if (persons.find(p => p.name === name)) {
    return res.status(400).json({ error: 'Name must be unique' });
  }

  const newPerson = { id: generateId(persons), name, number };
  persons.push(newPerson);
  res.status(201).json(newPerson);
});

module.exports = router;
