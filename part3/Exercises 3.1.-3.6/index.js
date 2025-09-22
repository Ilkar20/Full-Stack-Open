const express = require('express');
const app = express();
const persons = require('./models/person');

app.get('/api/persons', (req, res) => {
  res.json(persons);
});

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})