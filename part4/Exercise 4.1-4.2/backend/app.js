const express = require('express')
const cors = require('cors')
const middleware = require('./utils/middleware')
const personsRouter = require('./routes/persons')
const Person = require('./models/person')


const app = express()

// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.static('dist'))
app.use(middleware.morganLogger)
app.use(middleware.requestLogger)

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

// Unknown endpoint
app.use(middleware.unknownEndpoint)

// Error handling middleware
app.use(middleware.errorHandler)

module.exports = app
