const assert = require('node:assert')
const { test, after, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const app = require('../app')

const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

const api = supertest(app)

describe('When there is one user with two blogs in DB', async () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })
    const savedUser = await user.save()

    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs.map(
      (blog) =>
        new Blog({
          ...blog,
          user: savedUser._id,
        })
    )

    const savedBlogs = await Blog.insertMany(blogObjects)

    savedUser.blogs = savedBlogs.map((blog) => blog._id)
    await savedUser.save()
  })

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
  })

  test('all blogs are returned', async () => {
    const res = await api.get('/api/blogs')

    assert.strictEqual(res.body.length, helper.initialBlogs.length)
  })

  test('blog identifier is "id"', async () => {
    const blogs = await helper.blogsInDB()

    assert('id' in blogs[0])
    assert.strictEqual('_id' in blogs[0], false)
  })

  test('blog post increases total blogs', async () => {
    const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const newBlog = {
      title: 'first',
      author: 'me',
      url: 'www.me.first',
      likes: 420,
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const endBlogs = await helper.blogsInDB()
    assert.strictEqual(endBlogs.length, helper.initialBlogs.length + 1)
  })

  test('undefined likes default to zero', async () => {
    const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const newBlog = {
      title: 'First',
      author: 'Me',
      url: 'www.me.first',
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const endBlogs = await helper.blogsInDB()

    const likes = endBlogs.map((blog) => blog.likes)
    assert(likes.includes(0))
  })

  test('post with a title missing returns 400', async () => {
    const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const newBlog = {
      author: 'me',
      url: 'www.me.first',
      likes: 420,
    }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
  })

  test('post with a missing url returns 400', async () => {
    const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const newBlog = {
      title: 'First',
      author: 'me',
      likes: 420,
    }

    await api.post('/api/blogs').set('Authorization', `Bearer ${token}`).send(newBlog).expect(400)
  })

  test('post with a false token returns 401', async () => {
    const newBlog = {
      title: 'First',
      author: 'me',
      url: 'www.me.first',
      likes: 420,
    }

    await api.post('/api/blogs').send(newBlog).expect(401)
  })

  test('delete with valid id works', async () => {
    const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const startBlogs = await helper.blogsInDB()

    await api.delete(`/api/blogs/${startBlogs[0].id}`).set('Authorization', `Bearer ${token}`).expect(204)

    const endBlogs = await helper.blogsInDB()

    const ids = endBlogs.map((n) => n.id)
    assert(!ids.includes(startBlogs[0].id))

    assert.strictEqual(startBlogs.length - 1, endBlogs.length)
  })

  test('delete with invalid id returns 404', async () => {
    await api.delete(`/api/notes/notexistingid`).expect(404)
  })

  test('any user can like', async () => {
    const passwordHash = await bcrypt.hash('supersekret', 10)
    const user = new User({ username: 'sally', passwordHash })
    const anotherUser = await user.save()

    const loginResponse = await api.post('/api/login').send({ username: 'sally', password: 'supersekret' })
    const token = loginResponse.body.token

    const startBlogs = await helper.blogsInDB()

    const newInfo = {
      title: `${startBlogs[0].title}`,
      author: `${startBlogs[0].author}`,
      url: `${startBlogs[0].url}`,
      likes: startBlogs[0].likes + 1,
    }

    await api
      .put(`/api/blogs/${startBlogs[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const endBlogs = await helper.blogsInDB()
    assert.strictEqual(endBlogs[0].likes, newInfo.likes)
  })

  test('full update requires auth and works', async () => {
    const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const startBlogs = await helper.blogsInDB()

    const newInfo = {
      title: 'First',
      author: 'Me',
      url: 'www.me.first',
      likes: 1,
    }

    await api
      .put(`/api/blogs/${startBlogs[0].id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(newInfo)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const endBlogs = await helper.blogsInDB()
    assert.strictEqual(endBlogs[0].likes, newInfo.likes)
  })

  test('invalid update id returns 404', async () => {
    const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const newInfo = {
      title: 'First',
      author: 'Me',
      url: 'www.me.first',
      likes: 1,
    }

    await api
      .put(`/api/blogs/665f1f2c0c7a2a1234567890`)
      .set('Authorization', `Bearer ${token}`)
      .send(newInfo)
      .expect(404)
  })

  test('invalid parameters returns 400', async () => {
    const loginResponse = await api.post('/api/login').send({ username: 'root', password: 'sekret' })
    const token = loginResponse.body.token

    const startBlogs = await helper.blogsInDB()
    const newInfo = {
      title: 'First',
      author: 'Me',
      likes: 1,
    }

    await api.put(`/api/blogs/${startBlogs[0].id}`).set('Authorization', `Bearer ${token}`).send(newInfo).expect(400)
  })

  test('too short username is not added', async () => {
    const startUsers = await helper.usersInDB()

    const newUser = {
      username: 'ak',
      name: 'some guy',
      password: 'longenough',
    }

    const res = await api.post('/api/users').send(newUser).expect(400)
    assert(res.body.error.includes('username and password must be at least 3 characters long'))

    const endUsers = await helper.usersInDB()
    assert.strictEqual(endUsers.length, startUsers.length)
  })

  test('too short password is not added', async () => {
    const startUsers = await helper.usersInDB()

    const newUser = {
      username: 'aapo',
      name: 'some guy',
      password: 'no',
    }

    const res = await api.post('/api/users').send(newUser).expect(400)
    assert(res.body.error.includes('username and password must be at least 3 characters long'))

    const endUsers = await helper.usersInDB()
    assert.strictEqual(endUsers.length, startUsers.length)
  })

  test('user with no password is not added', async () => {
    const startUsers = await helper.usersInDB()

    const newUser = {
      username: 'aapo',
      name: 'some dude',
    }

    const res = await api.post('/api/users').send(newUser).expect(400)
    assert(res.body.error.includes('username and password are required'))

    const endUsers = await helper.usersInDB()
    assert.strictEqual(endUsers.length, startUsers.length)
  })

  test('user with no username is not added', async () => {
    const startUsers = await helper.usersInDB()

    const newUser = {
      name: 'some dude',
      password: 'longenough',
    }

    const res = await api.post('/api/users').send(newUser).expect(400)
    assert(res.body.error.includes('username and password are required'))

    const endUsers = await helper.usersInDB()
    assert.strictEqual(endUsers.length, startUsers.length)
  })

  test('duplicate username returns 400', async () => {
    const newUser = {
      username: 'root',
      name: 'some dude',
      password: 'longenough',
    }

    const res = await api.post('/api/users').send(newUser).expect(400)
    assert(res.body.error.includes('expected `username` to be unique'))
  })
})

after(async () => {
  await mongoose.connection.close()
})
