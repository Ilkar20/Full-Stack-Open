const express = require('express');
const cors = require('cors')

const morganLogger = require('./middlewares/morganLogger')
const personsRouter = require('./routes/persons')
const Person = require('./models/person');
const e = require('express');

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morganLogger)

// Routes
app.use('/api/persons', personsRouter)

// Info route
app.get('/info', (req, res) => {
  Person.countDocuments({})
    .then(count => {
      const info = `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
      res.send(info)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: error.message })
    })
})

module.exports = app
