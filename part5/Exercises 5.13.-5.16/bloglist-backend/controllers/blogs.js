const blogRouter = require('express').Router()
const Blog = require('../models/blog')

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1 })
  response.json(blogs)
})

blogRouter.post('/', async (request, response, next) => {
  try {
    const { title , author, url, likes } = request.body
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    if (!title || !url) {
      return response.status(400).json({ error: 'title or url missing' })
    }

    const blog = new Blog({
      title,
      author,
      url,
      likes: likes || 0,
      user: user._id
    })
    const savedBlog = await blog.save()

    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
  } catch (error) {
    next(error)
  }
})

blogRouter.delete('/:id', async (request, response, next) => {
  try {
    const user = request.user

    if (!user) {
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = await Blog.findById(request.params.id)
    if (!blog) {
      return response.status(404).json({ error: 'blog not found' })
    }
    if ( blog.user.toString() !== user._id.toString() ) {
      return response.status(403).json({ error: 'only the creator can delete a blog' })
    }

    await Blog.findByIdAndDelete(request.params.id)
    user.blogs = user.blogs.filter(b => b.toString() !== request.params.id)
    await user.save()

    response.status(204).end()
  } catch (error) {
    next(error)
  }
})

blogRouter.put('/:id', async (request, response, next) => {
  const { title, author, url, likes } = request.body

  const blog = {
    title,
    author,
    url,
    likes
  }

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      request.params.id,
      blog,
      { new: true, runValidators: true, context: 'query' }
    )

    if (updatedBlog) {
      response.json(updatedBlog)
    } else {
      response.status(404).end()
    }
  }
  catch (error) {
    next(error)
  }
})

module.exports = blogRouter