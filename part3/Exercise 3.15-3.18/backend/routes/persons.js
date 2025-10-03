const express = require('express');
const router = express.Router();
const personsController = require('../controllers/personsController')

// GET all persons
router.get('/', personsController.getAllPersons)

// GET person by id
router.get('/:id', personsController.getPerson)

// DELETE person
router.post('/', personsController.createPerson)

// POST new person
router.delete('/:id', personsController.deletePerson)

// PUT update person
router.put('/:id', personsController.updatePerson)

module.exports = router;
