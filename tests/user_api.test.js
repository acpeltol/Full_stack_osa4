const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const assert = require('node:assert')

const api = supertest(app)

const initialNotes = [
  {
    username: 'Alex',
    name: 'Jack Balzack',
    passwordHash: 'kevin_kostneero'
  },
  {
    username: 'Fitcher',
    name: 'Fitcher Collin',
    passwordHash: 'ajajajajaj'
  },
]

test.only('users are returned as json', async () => {
  await api.get('/api/users')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('user successfully added', async () => {

  const person = {
    username: 'Alack',
    name: 'Jack Balzack',
    password: '12345'
  }

  await api.post('/api/users').send(person)
    .expect(201)

})

test.only('username can not be the same', async () => {

  const person = {
    username: 'Alex',
    name: 'Jack Balzack',
    password: 'kevin_kostneero'
  }

  await api.post('/api/users').send(person)
    .expect(400)

})

test.only('username cant be shorter than 3', async () => {

  const person = {
    username: 'Al',
    name: 'Jack Balzack',
    password: 'kevin_kostneero'
  }

  await api.post('/api/users').send(person)
    .expect(400)

})

test.only('username cant be shorter than 3', async () => {

  const person = {
    username: 'Alack',
    name: 'Jack Balzack',
    password: '12'
  }

  await api.post('/api/users').send(person)
    .expect(400)

})

beforeEach(async () => {
  await User.deleteMany({})
  let noteObject = new User(initialNotes[0])
  await noteObject.save()
  noteObject = new User(initialNotes[1])
  await noteObject.save()
})


after(async () => {
  await User.deleteMany({})
  await mongoose.connection.close()
})