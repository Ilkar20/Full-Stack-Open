const express = require('express')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const config = require('./utils/config')
const logger = require('./utils/logger')
const middleware = require('./middleware/middleware')
const blogRouter = require('./controllers/blogs')

const app = express()

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connection to MongoDB:', error.message)
  })

app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogRouter)

// Middleware
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app
