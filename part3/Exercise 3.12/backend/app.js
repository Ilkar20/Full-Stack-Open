const express = require('express');
const cors = require('cors')

const morganLogger = require('./middlewares/morganLogger')
const personsRouter = require('./routes/persons')
const Person = require('./models/person')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(morganLogger)

// Routes
app.use('/api/persons', personsRouter)

// Info route
app.get('/info', async (req, res, next) => {
  try {
    const count = await Person.countDocuments({})
    res.send(`<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`)
  } catch (error) {
    next(error)
  }
})

module.exports = app
