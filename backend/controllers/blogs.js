const jwt = require('jsonwebtoken')
const blogRouter = require('express').Router()
const { userExtractor } = require('../utils/middleware')
const Blog = require('../models/blog')
const User = require('../models/user')

blogRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({}).populate('user', {
    username: 1,
    name: 1,
    id: 1,
  })

  res.json(blogs)
})

blogRouter.post('/', userExtractor, async (req, res) => {
  const user = req.user
  const body = req.body
  if (!user) {
    return res.status(400).json({ error: 'UserId missing or not valid' })
  }
  if (!(body.title && body.url)) {
    return res.status(400).json({ error: 'title and url are required' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes || 0,
    user: user._id,
  })

  const savedBlog = await blog.save()
  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  res.status(201).json(savedBlog)
})

blogRouter.delete('/:id', userExtractor, async (req, res) => {
  const blog = await Blog.findById(req.params.id)
  if (!(blog.user.toString() === req.user._id.toString())) {
    return res.status(401).json({ error: 'blog owner and user do not match' })
  }
  await Blog.findByIdAndDelete(req.params.id)
  res.status(204).end()
})

blogRouter.put('/:id', userExtractor, async (req, res) => {
  const { title, author, url, likes } = req.body

  const blog = await Blog.findById(req.params.id)
  if (!blog) {
    return res.status(404).end()
  }
  if (!title || !url) {
    return res.status(400).end()
  }
  if (title !== blog.title || author !== blog.author || url !== blog.url) {
    if (!(blog.user.toString() === req.user._id.toString())) {
      return res.status(401).json({ error: 'Cannot change content of other users blog' })
    }
  }

  blog.title = title
  blog.author = author
  blog.url = url
  blog.likes = likes ?? blog.likes

  const updatedBlog = await blog.save()

  res.status(200).json(updatedBlog)
})

module.exports = blogRouter
