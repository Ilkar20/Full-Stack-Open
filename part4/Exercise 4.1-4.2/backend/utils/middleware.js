const morgan = require('morgan')
const logger = require('./logger')

// Create a custom Morgan token to log request body for POST requests
morgan.token('body', (req) => (req.method === 'POST' ? JSON.stringify(req.body) : ''))

// Morgan request logger middleware
const morganLogger = morgan(':method :url :status :res[content-length] - :response-time ms :body')

// Custom request logger middleware using your logger utility
const requestLogger = (req, res, next) => {
  logger.info('Method:', req.method)
  logger.info('Path:  ', req.path)
  logger.info('Body:  ', req.body)
  logger.info('---')
  next()
}

// Unknown endpoint handler
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// Centralized error handler
const errorHandler = (error, req, res, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }

  next(error)
}

module.exports = {
  morganLogger,
  requestLogger,
  unknownEndpoint,
  errorHandler,
}
