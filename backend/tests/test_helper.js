const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'testing 1',
    author: 'TDD dev',
    url: 'thisisatest.com',
    likes: 1,
  },
  {
    title: 'vibin',
    author: 'vibe coder',
    url: 'thirtythousandlines.com',
    likes: 67,
  },
]

const blogsInDB = async () => {
  const blogs = await Blog.find({})
  return blogs.map((b) => b.toJSON())
}

const usersInDB = async () => {
  const users = await User.find({})
  return users.map((b) => b.toJSON())
}

module.exports = {
  initialBlogs,
  blogsInDB,
  usersInDB,
}
