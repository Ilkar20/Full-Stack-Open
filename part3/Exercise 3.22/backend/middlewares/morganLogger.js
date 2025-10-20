const morgan = require('morgan')

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')

module.exports = morgan(':method :url :status :res[content-length] - :response-time ms :body')
