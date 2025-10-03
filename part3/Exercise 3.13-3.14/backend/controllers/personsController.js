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
    else res.status(404).json({ error: 'Person not found' })
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

    const existingPerson = await Person.findOne({ name })
    if (existingPerson) {
      return res.status(400).json({ error: 'Name must be unique' })
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
    const deteled = await Person.findByIdAndDelete(req.params.id)
    if (deteled) res.status(200).json({ message: 'Person deleted' })
    else res.status(404).json({ error: 'Person not found' })
    res.status(204).end()
  } catch (error) {
    next(error)
  }
}

// Update person
const updatePerson = async (req, res, next) => {
  try {
    const { name, number } = req.body
    const updatedPerson = await Person.findByIdAndUpdate(
      req.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    if (updatedPerson) res.json(updatedPerson)
    else res.status(404).json({ error: 'Person not found' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getAllPersons,
  getPerson,
  createPerson,
  deletePerson,
  updatePerson 
}
