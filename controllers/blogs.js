const blogsRouter = require('express').Router()
//const blog = require('../models/blog')
const Blog = require('../models/blog')


blogsRouter.get('/', async (request, response, next) => {
  Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    }).catch(error => {
      console.log('hier')
      next(error)})
})

blogsRouter.post('/',async (request, response, next) => {
  const blog = new Blog(request.body)
  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    }).catch(error => next(error))
})

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id)
  response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {

  await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true })
  response.status(204).end()
})



module.exports = blogsRouter