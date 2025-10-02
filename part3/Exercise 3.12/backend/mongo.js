require('dotenv').config()
const mongoose = require('mongoose')

const args = process.argv
// args[0] = node
// args[1] = mongo.js
// args[2] = password or other parameter
// args[3] = name
// args[4] = number

if (args.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = args[2]
const name = args[3]
const number = args[4]

console.log('MONGO_URI from .env:', process.env.PORT)
console.log('MONGO_URI from .env:', process.env.MONGO_URI)


const url = process.env.MONGO_URI.replace('<password>', password)

mongoose.set('strictQuery',false)

mongoose.connect(url)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(error => {
        console.log('Error connecting to MongoDB:', error)
    })

const PersonSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', PersonSchema)

if (name && number) {
    const person = new Person({ name, number })
    person.save()
        .then(savedPerson => {
            console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
            mongoose.connection.close()
        })
        .catch(error => {
            console.error(error)
            mongoose.connection.close()
        })
}
else {
    Person.find({})
      .then(persons => {
        if (!persons || persons.length === 0) {
          console.log('phonebook is empty')
        } else {
          console.log('phonebook:')
          persons.forEach(person => {
            console.log(`${person.name} ${person.number}`)
          })
        }
        mongoose.connection.close()
      })
      .catch(err => {
        console.error(err)
        mongoose.connection.close()
      })
}
