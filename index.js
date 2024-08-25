const express = require('express')
const morgan = require('morgan')

const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')
const app = express()

app.use(express.static('./dist'))
app.use(cors())

morgan.token('response-data', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ' '
})

app.use(express.json())
app.use(
  morgan(
    ':method :url :status :res[content-length] - :response-time ms :response-data',
  ),
)

const PORT = process.env.PORT || 3001

app.get('/api/persons', (_req, res, next) => {
  Person.find({})
    .then((persons) => {
      return res.status(200).json(persons)
    })
    .catch((error) => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findById(id)
    .then((person) => {
      if (!person) {
        return res.status(404).end()
      }
      return res.status(200).json(person)
    })
    .catch((error) => {
      next(error)
    })
  // const person = persons.find((person) => person.id === id);
  //
  // if (!person) {
  //   return res
  //     .status(404)
  //     .json({ message: `unable to find person of id: ${id}` });
  // }
  // return res.status(200).json(person);
})

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  Person.findByIdAndDelete(id)
    .then((result) => {
      if (!result) {
        return res.status(404).end()
      }
      return res.status(200).json(result)
    })
    .catch((error) => {
      return next(error)
    })
  // const person = persons.find((person) => person.id === id);
  // if (!person) {
  //   return res
  //     .status(404)
  //     .json({ error: `unable to find person of id: ${id}` });
  // }
  // persons = persons.filter((person) => person.id !== id);
  //
  // return res.status(200).json(person);
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  if (!body.name) {
    return res.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return res.status(400).json({ error: 'number missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person
    .save()
    .then((savedPerson) => {
      return res.status(201).json(savedPerson)
    })
    .catch((error) => next(error))

  // const isPerson = persons.find((p) => p.name === body.name);
  // if (isPerson) {
  //   return res
  //     .status(400)
  //     .json({ error: `${isPerson.name} is already in phonebook` });
  // }
  //
  // const newPerson = {
  //   id: String(generateNewId()),
  //   name: body.name,
  //   number: body.number,
  // };
  // persons = persons.concat(newPerson);
  //
  // return res.status(201).json(newPerson);
})

app.get('/info', (_req, res) => {
  Person.find({}).then((persons) => {
    const personsCount = persons.length
    const currentTime = new Date().toString()
    return res.send(
      `<p>Phonebook has info for ${personsCount} people!</p><p>${currentTime}</p>`,
    )
  })
})

app.put('/api/persons/:id', (req, res, next) => {
  const id = req.params.id
  const body = req.body
  if (!body.name) {
    return res.status(400).json({ error: 'name missing' })
  }

  if (!body.number) {
    return res.status(400).json({ error: 'number missing' })
  }

  const newPerson = {
    name: body.name,
    number: body.number,
  }
  console.log(newPerson)

  Person.findByIdAndUpdate(id, newPerson, { new: true, runValidators: true })
    .then((updatedPerson) => {
      if (!updatedPerson) {
        return res.status(404).end()
      }
      console.log(updatedPerson)
      return res.status(200).json(updatedPerson)
    })
    .catch((error) => next(error))
})

// error handler

function errorHandler(error, _req, res, next) {
  console.log('error name', error.name)
  console.log('error message', error.message)
  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return res.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
