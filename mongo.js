const mongoose = require('mongoose')
require('dotenv').config()

const url = process.env.MONGODB_URL

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[2] && process.argv[3]) {
  return addPerson(process.argv[2], process.argv[3])
} else {
  Person.find().then((results) => {
    console.log('phonebook:')
    results.forEach((person) => {
      console.log(person.name, person.number)
    })
    mongoose.connection.close()
  })
}

function addPerson(name, number) {
  const person = new Person({
    name: name,
    number: number,
  })

  person.save().then((result) => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}
