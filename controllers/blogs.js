const blogsRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({}).populate('user')

  response.json(blogs)
})

blogsRouter.post('/',async (request, response) => {
  let body = request.body

  console.log(request.token)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }

  const user = request.user

  console.log(body)

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.json(savedBlog)
})


blogsRouter.delete('/:id', async (request, response) => {
  console.log(request.token)

  const blog = await Blog.findById(request.params.id)

  const decodedToken = jwt.verify(request.token, process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  //const user = await User.findById(decodedToken.id)
  const user = request.user

  console.log(blog)

  console.log(user)

  const userid = user.id

  if (blog.user.toString() === userid.toString() ){
    console.log('heheheh')
    await Blog.findByIdAndDelete(request.params.id)
    return response.status(204).end()
  }

  response.status(403).json({ error: 'premission denied' })
})

blogsRouter.put('/:id', async (request, response) => {

  await Blog.findByIdAndUpdate(
    request.params.id,
    request.body,
    { new: true })
  response.status(204).end()
})



module.exports = blogsRouter