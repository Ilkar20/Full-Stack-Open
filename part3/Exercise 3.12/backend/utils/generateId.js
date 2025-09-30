const persons = require('../models/person')

const generateId = () => {
  const maxId = persons.length > 0 ? Math.max(...persons.map(p => Number(p.id))) : 0
  return String(maxId + 1)
}

module.exports = generateId
