const express = require('express')
const cors = require('cors')
const morganLogger = require('./middlewares/morganLogger')
const errorHandler = require('./middlewares/errorHandler')
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
app.get('/info', (req, res, next) => {
  Person.countDocuments({})
    .then(count => {
      const info = `<p>Phonebook has info for ${count} people</p><p>${new Date()}</p>`
      res.send(info)
    })
    .catch(error => {
      next(error)
    })
})

app.use((req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' })
} )

// Error handling middleware
app.use(errorHandler)

module.exports = app
