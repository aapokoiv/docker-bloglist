const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }

  return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
  const fav = blogs.reduce((favorite, blog) => {
    return favorite === null || blog.likes > favorite.likes ? blog : favorite
  }, null)
  return fav
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null
  let authors = new Object()
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].author in authors) {
      authors[blogs[i].author] = authors[blogs[i].author] + 1
    } else {
      authors[blogs[i].author] = 1
    }
  }
  const mostAuthor = Object.keys(authors).reduce((a, b) => (authors[a] > authors[b] ? a : b))
  return {
    author: mostAuthor,
    blogs: authors[mostAuthor],
  }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null
  let authors = new Object()
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].author in authors) {
      authors[blogs[i].author] = authors[blogs[i].author] + blogs[i].likes
    } else {
      authors[blogs[i].author] = blogs[i].likes
    }
  }
  const mostLikes = Object.keys(authors).reduce((a, b) => (authors[a] > authors[b] ? a : b))
  return {
    author: mostLikes,
    likes: authors[mostLikes],
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}
