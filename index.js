/* let persons = [
  {
    name: "Arto Hellas",
    number: "040-123456",
    id: 1,
  },
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Mary Poppendieck",
    number: "39-23-6423122",
    id: 4,
  },
]; */
require('dotenv').config()

const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

const requestLogger = require('./middlewares/requestLogger')
const errorHandler = require('./middlewares/errorHandler')

const app = express()

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
app.use(morgan(requestLogger))

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(person => {
    response.json(person)
  }).catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
  const timestamp = new Date()

  Person.countDocuments({}, (error, count) => {
    response.json({ info: `Phonebook contains ${count} people,`, timestamp })
  }).catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findById(id).then(person => {
    (person) ? response.json(person) : response.status(404).end()
  }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  const id = request.params.id

  Person.findByIdAndDelete(id).then(() => {
    response.status(204).json(person)
  }).catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing :('
    })
  }

  const person = {
    name: body.name,
    number: body.number
  }

  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const person = request.body

  Person.findById(id).then(person => {
    (person) ? response.json(person) : response.status(404).end()
  }).catch(error => next(error))

  const personToUpdate = {
    name: person.name,
    number: person.number
  }

  Person.findByIdAndUpdate(id, personToUpdate, { new: true }).then(updatedPerson => {
    response.json(updatedPerson)
  }).catch(error => next(error))
})

const unknownEndpoint = (request, response) =>
  response.status(404).send({ error: 'unknown endpoint' })
app.use(unknownEndpoint)

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
