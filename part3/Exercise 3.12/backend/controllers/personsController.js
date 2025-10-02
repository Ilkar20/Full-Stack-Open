const Person = require('../models/person')

// Get all persons
const getAllPersons = async (req, res, next) => {
  try {
    const persons = await Person.find({})
    res.json(persons)
  } catch (error) {
    next(error)
  }
}

// Get one person
const getPerson = async (req, res, next) => {
  try {
    const person = await Person.findById(req.params.id)
    if (person) res.json(person)
    else res.status(404).end()
  } catch (error) {
    next(error)
  }
}

// Create new person
const createPerson = async (req, res, next) => {
  try {
    const { name, number } = req.body
    if (!name || !number) {
      return res.status(400).json({ error: 'Name or number is missing' })
    }

    const newPerson = new Person({ name, number })
    const savedPerson = await newPerson.save()
    res.status(201).json(savedPerson)
  } catch (error) {
    next(error)
  }
}

// Delete person
const deletePerson = async (req, res, next) => {
  try {
    await Person.findByIdAndDelete(req.params.id)
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllPersons,
  getPerson,
  createPerson,
  deletePerson
}
