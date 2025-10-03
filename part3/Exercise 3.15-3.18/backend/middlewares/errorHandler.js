const errorHandler = (err, req, res, next) => {
  console.error(err.message)
    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'Malformatted id' })
    }
    else if (err.name === 'ValidationError') {
        return res.status(400).send({ error: err.message })
    }
    
    res,status(500).send({ error: 'Internal server error' })
}

module.exports = errorHandler