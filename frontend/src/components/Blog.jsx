import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { colors, Button } from './sharedStyles.js'
import { useUser, useBlogs, useBlogActions } from '../store.js'

const BlogGroup = styled.div`
  background: ${colors.aliceBlue};
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 1rem;
  color: ${colors.charcoalBrown};
  margin: 2rem 0;
  max-width: 32rem;
  padding: 1.5rem;
`

const BlogLine = styled.div`
  margin: 1rem 0;
`

const LikeButton = styled.button`
  background: #fff;
  color: ${colors.skyAqua};
  border: 2px solid ${colors.skyAqua};
  border-radius: 9px;
  cursor: pointer;
  padding: 0.25rem 0.5rem;

  &:hover {
    background: #eee;
  }
`

const DeleteButton = styled.button`
  background: #fff;
  color: ${colors.softBlossom};
  border: 2px solid ${colors.softBlossom};
  border-radius: 9px;
  cursor: pointer;
  padding: 0.25rem 0.5rem;

  &:hover {
    background: #eee;
  }
`

const Blog = () => {
  const { id } = useParams()
  const { updateBlog, deleteBlog } = useBlogActions()
  const blogs = useBlogs()
  const user = useUser()
  const navigate = useNavigate()

  const blog = blogs.find((b) => b.id === id)

  if (!blog) {
    return <h2>404 - Page not found</h2>
  }

  const likeBlog = async () => {
    const newBlog = {
      title: blog.title,
      author: blog.author,
      url: blog.url,
      likes: blog.likes + 1,
    }
    try {
      await updateBlog(blog.id, newBlog)
    } catch {
      return
    }
  }

  const removeBlog = async () => {
    if (window.confirm(`Remove ${blog.title}?`)) {
      try {
        await deleteBlog(blog.id)
      } catch {
        return
      }
      navigate('/')
    }
  }

  const ownedByUser = () => user && user.id === blog.user.id

  return (
    <BlogGroup>
      <div>
        <h2>
          <strong>{blog.title}</strong>
        </h2>
      </div>
      <BlogLine>By {blog.author}</BlogLine>
      <BlogLine>
        <a href={blog.url}>{blog.url}</a>
      </BlogLine>
      <BlogLine>Added by: {blog.user.name}</BlogLine>
      <BlogLine>
        {blog.likes} Likes
        {user && (
          <LikeButton onClick={() => likeBlog()} style={{ marginLeft: '0.5rem' }}>
            like
          </LikeButton>
        )}
        {ownedByUser() && (
          <DeleteButton onClick={removeBlog} style={{ marginLeft: '0.5rem' }}>
            delete
          </DeleteButton>
        )}
      </BlogLine>
    </BlogGroup>
  )
}

export default Blog
