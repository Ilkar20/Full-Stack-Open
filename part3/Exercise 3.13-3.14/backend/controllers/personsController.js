const Person = require('../models/person')

// Get all persons
const getAllPersons = (req, res) => {
  Person.find({})
    .then(persons => {
      res.json(persons)
    })
    .catch(error => {
      console.log(error)
      res.status(500).json({ error: error.message })
    })
}

// Get one person
const getPerson = (req, res) => {
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
      console.log(error)
      res.status(400).json({ error: 'Malformatted id' })
    })
}

// Create new person
const createPerson = (req, res) => {
  const { name, number } = req.body
  if (!name || !number) {
    return res.status(400).json({ error: 'Name or number is missing' })
  }

  Person.findOne({ name })
    .then(existingPerson => {
      if (existingPerson) {
        return res.status(400).json({ error: 'Name must be unique' })
      }

      const newPerson = new Person({ name, number })
      newPerson.save()
        .then(savedPerson => res.status(201).json(savedPerson))
        .catch(error => res.status(400).json({ error: error.message }))
    })
    .catch(error => res.status(500).json({ error: error.message }))
}

// Delete person
const deletePerson = (req, res) => {
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
      console.log(error)
      res.status(400).json({ error: 'Malformatted id' })
    })
}

// Update person
const updatePerson = (req, res) => {
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
      console.log(error)
      res.status(400).json({ error: 'Malformatted id or validation error' })
    })
}

module.exports = {
  getAllPersons,
  getPerson,
  createPerson,
  deletePerson,
  updatePerson
}
