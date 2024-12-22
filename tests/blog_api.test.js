const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const assert = require('node:assert')

const api = supertest(app)

let token

const initialBlogs = [
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
  // await Blog.deleteMany({})
  // let noteObject = new Blog(initialNotes[0])
  // await noteObject.save()
  // noteObject = new Blog(initialNotes[1])
  // await noteObject.save()

  await Blog.deleteMany({})
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('ABBA', 10)
  const user = new User({ username: 'Alejandro', passwordHash })
  await user.save()


  token = jwt.sign({ id: user._id }, process.env.SECRET)
})

test.only('blogs are returned as json', async () => {
  await api.get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test.only('Length of blogs is right', async () => {
  const response = await api.get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body.length, 0)
})

test.only('Idnetifying field is named id', async () => {
  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(initialBlogs[1])


  const response = await api.get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  console.log(response.body)

  assert(response.body[0].id !== undefined)
})

test.only('Length of blogs is right2', async () => {

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(initialBlogs[0])


  const response = await api.get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body.length, 1)
})

test.only('If likes field is not filled then deafult value is 0', async() => {
  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(initialBlogs[1])


  const response = await api.get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response.body[0].likes, 0)
})

test.only('if title and url fields then statuscode 400', async () => {
  let noteObject = {
    title: 'Huels Pakarmann',
    author: 'Jimbo',
    likes: 347
  }

  await api.post('/api/blogs')
    .send(noteObject)
    .set('Authorization', `Bearer ${token}`)
    .expect(400)
})

test.only('Deleting is succesfull', async () => {
  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(initialBlogs[0])

  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(initialBlogs[1])

  const response = await api.get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  await api.delete(`/api/blogs/${response.body[1].id}`)
    .set('Authorization', `Bearer ${token}`)

  const response2 = await api.get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response2.body.length, 1)
})

test.only('uptading is succesfull', async () => {
  await api.post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(initialBlogs[0])

  const response = await api.get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  const update = response.body[0]
  update.likes = 10

  await api.put(`/api/blogs/${response.body[0].id}`)
    .set('Authorization', `Bearer ${token}`)
    .send(update)

  const response2 = await api.get('/api/blogs')
    .set('Authorization', `Bearer ${token}`)

  assert.strictEqual(response2.body[0].likes, 10)
})

test.only('Posting fails with status code 401 if autentification key is not given', async () => {
  await api.post('/api/blogs')
    .send(initialBlogs[0])
    .expect(401)
})

after(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})
  await mongoose.connection.close()
})