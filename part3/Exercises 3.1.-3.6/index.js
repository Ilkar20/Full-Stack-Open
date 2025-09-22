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
 

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})