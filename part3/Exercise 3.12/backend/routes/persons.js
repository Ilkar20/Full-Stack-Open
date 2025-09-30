const express = require('express');
const router = express.Router();
const persons = require('../models/person');
const generateId = require('../utils/generateId');

// GET all persons
router.get('/', personsController.getAllPersons)

// GET person by id
router.get('/:id', personsController.getPerson)

// DELETE person
router.post('/', personsController.createPerson)

// POST new person
router.delete('/:id', personsController.deletePerson)

module.exports = router;
