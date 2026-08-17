import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import styled from 'styled-components'
import userService from '../services/users.js'
import { colors } from './sharedStyles.js'

const UserSection = styled.div`
  background: ${colors.aliceBlue};
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 1rem;
  color: ${colors.charcoalBrown};
  margin: 2rem 0;
  max-width: 32rem;
  padding: 1.5rem;
`

const BlogList = styled.ul`
  display: grid;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
`

const BlogItem = styled.li`
  background: #fff;
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
`

const BlogLink = styled(Link)`
  color: ${colors.charcoalBrown};
  font-weight: 700;

  &:hover {
    color: ${colors.skyAqua};
  }
`

const User = () => {
  const { id } = useParams()
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then(setUsers)
  }, [])

  const user = users.find((u) => u.id === id)

  if (!user) return null

  return (
    <UserSection>
      <h2>{user.name}</h2>
      <h3>added blogs:</h3>
      <BlogList>
        {user.blogs.map((blog) => (
          <BlogItem key={blog.id}>
            <BlogLink to={`/blogs/${blog.id}`}>{blog.title}</BlogLink>
          </BlogItem>
        ))}
      </BlogList>
    </UserSection>
  )
}

export default User
