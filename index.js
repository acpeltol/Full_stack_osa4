const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config()
const app = express()

const Phonebook = require('./models/phonebook')
const phonebook = require('./models/phonebook')

app.use(express.json())
app.use(morgan('tiny'))
app.use(cors())
app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error); 
};


let length_of_phonebook;

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
    console.log("Nothing special in this page")
  })
  
  app.get('/api/persons', (request, response) => {
    Phonebook.find({}).then(data => {
      console.log(data)
      length_of_phonebook = data.length
      response.json(data)
    })
    }
  )

  app.get('/api/persons/:id', (request, response, next) => {
    Phonebook.findById(request.params.id)
    .then(result => {
      if (result){
      response.send(result)}
      else{
        response.status(404).end()
      }
    }).catch(error =>
      next(error)
    )
  })

  app.get('/info', (request, response) => {
    const noe = new Date()
    console.log("hie gut")
    response.send(`<h3>Phonebook has info for ${length_of_phonebook} people</h3>
        <p>${noe}</p>`)
  })

  app.post('/api/persons', (request, response, next) => {
      
    const body = request.body

    if (body.name === undefined || body.number === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const note = new Phonebook({
          name: body.name,
          number: body.number,
        })
    
    
    note.save()
    .then(data => {
          console.log("Phonumber saved")
    
          console.log(data)
    
          length_of_phonebook = length_of_phonebook + 1
          response.json(data)

        }).catch(error => next(error))
  })





  app.put('/api/persons/:id', (request, response, next) =>{
    const id = request.params.id

    const body = request.body

    console.log(id, " ",body)

    //if (body.name === undefined || body.number === undefined) {
    //  return response.status(400).json({ error: 'content missing' })
    //}

    Phonebook.findByIdAndUpdate(id, 
      {number : body.number},
      {new:true, runValidators :true, context: "query"})
    .then(updated =>{
      if(updated){
      response.json(updated)}
      else{
        response.status(404).end()
      }
    }).catch(error => next(error))
  })


// Delete the user

  app.delete('/api/persons/:id', (request, response,next) => {
    
    Phonebook.findByIdAndDelete(request.params.id)
    .then(result => {
      console.log("Deleting")
      length_of_phonebook = length_of_phonebook - 1
      response.send(result)
    }).catch(error => next(error))
  })

  app.use(errorHandler);
  
  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })