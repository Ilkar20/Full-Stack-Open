const express = require('express');
const app = express();
const morganLogger = require('./middlewares/morganLogger');
const personsRouter = require('./routes/persons');
const path = require('path');

app.use(express.json());
app.use(morganLogger);
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api/persons', personsRouter);

// Info endpoint
const persons = require('./models/person');
app.get('/info', (req, res) => {
  const personCount = persons.length;
  const date = new Date();
  res.send(`<p>Phonebook has info for ${personCount} people</p><p>${date}</p>`);
});

module.exports = app;
