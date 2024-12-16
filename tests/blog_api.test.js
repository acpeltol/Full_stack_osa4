const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')

const api = supertest(app)

const initialNotes = [
  {
    title: 'Fill',
    author: 'Johnsson',
    url: 'Heyhey.com',
    likes: 0
  },
  {
    title: 'Fill Collin',
    author: 'Stram Johnsson',
    url: 'Jhkon.net',
  },
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let noteObject = new Blog(initialNotes[0])
  await noteObject.save()
  noteObject = new Blog(initialNotes[1])
  await noteObject.save()
})

test.only('blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('Length of blogs is right', async () => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 2)
})

test.only('Idnetifying field is named id', async () => {
  const response = await api.get('/api/blogs')

  assert(response.body[0].id !== undefined)
})

test.only('Length of blogs is right', async () => {

  let noteObject = {
    title: 'Huels Pakarmann',
    author: 'Jimbo',
    url: 'Albaran.arb',
    likes: 347
  }

  //await noteObject.save()

  await api.post('/api/blogs').send(noteObject)

  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body.length, 3)
})

test.only('If likes field is not filled then deafult value is 0', async() => {
  const response = await api.get('/api/blogs')

  assert.strictEqual(response.body[1].likes, 0)
})

test.only('if title and url fields then statuscode 400', async () =>{
  let noteObject = {
    title: 'Huels Pakarmann',
    author: 'Jimbo',
    likes: 347
  }

  await api.post('/api/blogs')
    .send(noteObject)
    .expect(400)
})

test.only('Deleting is succesfull', async () => {
  const response = await api.get('/api/blogs')
  await api.delete(`/api/blogs/${response.body[1].id}`)

  const response2 = await api.get('/api/blogs')

  assert.strictEqual(response2.body.length, 1)
})

test.only('uptading is succesfull', async () => {
  const response = await api.get('/api/blogs')
  const update = response.body[1]
  update.likes = 10
  await api.put(`/api/blogs/${response.body[1].id}`)
    .send(update)

  const response2 = await api.get('/api/blogs')

  assert.strictEqual(response2.body[1].likes, 10)
})

after(async () => {
  await mongoose.connection.close()
})