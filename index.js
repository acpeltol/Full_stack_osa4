const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

app.use(express.json())

app.use(morgan('tiny'))

app.use(cors())

let persons = [
  { 
    "name": "Arto Hellas", 
    "number": "040-123456",
    "id": "1"
  },
      { 
        "name": "Ada Lovelace", 
        "number": "39-44-5323523",
        "id": "2"
      },
      { 
        "name": "Dan Abramov", 
        "number": "12-43-234345",
        "id": "3"
      },
      { 
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122",
        "id": "4"
      }
  ]

  app.get('/', (request, response) => {
    response.send('<h1>Hello rlo!</h1>')
  })
  
  app.get('/api/persons', (request, response) => {
    response.json(persons)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const note = persons.find(note => note.id === id)
    
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
  })

  app.get('/info', (request, response) => {
    const noe = new Date()
    console.log("hie gut")
    response.send(`<h3>Phonebook has info for ${persons.length} people</h3>
        <p>${noe}</p>`)
  })

  app.post('/api/persons', (request, response) => {
      const note = request.body

      console.log(note)

      note.id = String(Math.floor(Math.random() * 1000000000))

      if(note.name && note.number){

      const namen = persons.find(person => person.name === note.name)

      const nummet = persons.find(person => person.number === note.number)

      console.log(namen)

      if(namen){
        response.status(404).send({ error: 'name must be unique' })
      }else if(nummet){
        response.status(404).send({ error: 'number must be unique' })
      }else{

        persons = persons.concat(note)

        console.log(persons)
        response.json(persons)
      }}
      
      else{
        response.status(404).send({ error: 'you muat have name and number in your json data' })

      }
  })

  app.delete('/api/persons/:id', (request, response) => {
    console.log("Deleting")
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })