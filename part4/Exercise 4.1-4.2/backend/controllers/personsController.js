const Person = require('../models/person')

// Get all persons
const getAllPersons = (req, res, next) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => {
      next(error)
    })
}

// Get one person
const getPerson = (req, res, next) => {
  Person.findById(req.params.id)
    .then(person => {
      if (person) {
        res.json(person)
      }
      else {
        res.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => {
      next(error)
    })
}

// Create new person
const createPerson = (req, res, next) => {
  const { name, number } = req.body
  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }

  const newPerson = new Person({ name, number })
  newPerson.save()
    .then(savedPerson => res.status(201).json(savedPerson))
    .catch(error => next(error))
}

// Update person
const updatePerson = (req, res, next) => {
  const { number } = req.body
  Person.findByIdAndUpdate(
    req.params.id,
    { number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      if (updatedPerson) res.json(updatedPerson)
      else res.status(404).json({ error: 'Person not found' })
    })
    .catch(error => {
      next(error)
    })
}

// Delete person
const deletePerson = (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(deleted => {
      if (deleted) {
        res.status(204).end()
      }
      else {
        res.status(404).json({ error: 'Person not found' })
      }
    })
    .catch(error => {
      next(error)
    })
}


module.exports = {
  getAllPersons,
  getPerson,
  createPerson,
  deletePerson,
  updatePerson
}
