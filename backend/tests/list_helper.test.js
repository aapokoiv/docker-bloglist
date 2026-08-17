const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')
const Blog = require('../models/blog')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('totalLikes', () => {
  test('of empty list is 0', () => {
    const blogs = []

    assert.strictEqual(listHelper.totalLikes(blogs), 0)
  })

  test('on list of one blog it equals the likes of that', () => {
    const blogs = [
      {
        title: 'a',
        author: 'A',
        url: 'www.test',
        likes: 4,
      },
    ]
    assert.strictEqual(listHelper.totalLikes(blogs), 4)
  })

  test('totalLikes is correct for bigger list', () => {
    const blogs = [
      {
        title: 'a',
        author: 'A',
        url: 'www.test',
        likes: 4,
      },
      {
        title: 'b',
        author: 'B',
        url: 'www.test',
        likes: 1,
      },
      {
        title: 'c',
        author: 'C',
        url: 'www.test',
        likes: 7,
      },
    ]
    assert.strictEqual(listHelper.totalLikes(blogs), 12)
  })
})

describe('favoriteBlog', () => {
  test('of empty is null', () => {
    assert.deepStrictEqual(listHelper.favoriteBlog([]), null)
  })

  test('of one blog is that one', () => {
    const blogs = [
      {
        title: 'a',
        author: 'A',
        url: 'www.test',
        likes: 4,
      },
    ]
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[0])
  })

  test('of many is correct', () => {
    const blogs = [
      {
        title: 'a',
        author: 'A',
        url: 'www.test',
        likes: 4,
      },
      {
        title: 'b',
        author: 'B',
        url: 'www.test',
        likes: 1,
      },
      {
        title: 'c',
        author: 'C',
        url: 'www.test',
        likes: 7,
      },
    ]
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), blogs[2])
  })
})

describe('mostBlogs', () => {
  test('of empty is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('of one returns the author and 1', () => {
    const blogs = [
      {
        title: 'a',
        author: 'A',
        url: 'www.test',
        likes: 4,
      },
    ]
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: 'A',
      blogs: 1,
    })
  })

  test('of many is correct', () => {
    const blogs = [
      {
        title: 'a',
        author: 'A',
        url: 'www.test',
        likes: 4,
      },
      {
        title: 'b',
        author: 'B',
        url: 'www.test',
        likes: 1,
      },
      {
        title: 'c',
        author: 'C',
        url: 'www.test',
        likes: 7,
      },
      {
        title: 'c2',
        author: 'C',
        url: 'www.test',
        likes: 3,
      },
    ]
    assert.deepStrictEqual(listHelper.mostBlogs(blogs), {
      author: 'C',
      blogs: 2,
    })
  })
})

describe('mostLikes', () => {
  test('of empty is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('of one returns the author and likes of the blog', () => {
    const blogs = [
      {
        title: 'a',
        author: 'A',
        url: 'www.test',
        likes: 4,
      },
    ]
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: 'A',
      likes: 4,
    })
  })

  test('of many is correct', () => {
    const blogs = [
      {
        title: 'a',
        author: 'A',
        url: 'www.test',
        likes: 4,
      },
      {
        title: 'b',
        author: 'B',
        url: 'www.test',
        likes: 1,
      },
      {
        title: 'c',
        author: 'C',
        url: 'www.test',
        likes: 7,
      },
      {
        title: 'c2',
        author: 'C',
        url: 'www.test',
        likes: 3,
      },
    ]
    assert.deepStrictEqual(listHelper.mostLikes(blogs), {
      author: 'C',
      likes: 10,
    })
  })
})
