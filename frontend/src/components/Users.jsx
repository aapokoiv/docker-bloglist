import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import userService from '../services/users.js'
import { colors } from './sharedStyles.js'

const UsersSection = styled.div`
  background: ${colors.aliceBlue};
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 1rem;
  color: ${colors.charcoalBrown};
  margin: 2rem 0;
  max-width: 32rem;
  padding: 1.5rem;
`

const UserGrid = styled.div`
  display: grid;
  gap: 0.75rem;
`

const UserHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 1rem;
  padding: 0 1rem 0.5rem;
  font-weight: 700;
  color: ${colors.charcoalBrown};
`

const UserRow = styled.div`
  align-items: center;
  background: #fff;
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 0.75rem;
  display: grid;
  gap: 1rem;
  grid-template-columns: 1fr 1fr auto;
  padding: 0.75rem 1rem;
`

const UserLink = styled(Link)`
  color: ${colors.charcoalBrown};
  font-weight: 700;

  &:hover {
    color: ${colors.skyAqua};
  }
`

const UserName = styled.span`
  color: ${colors.charcoalBrown};
  font-weight: 700;
`

const BlogCount = styled.span`
  background: ${colors.softBlossom};
  border-radius: 999px;
  color: ${colors.charcoalBrown};
  font-weight: 700;
  padding: 0.25rem 0.7rem;
`

const Users = () => {
  const [users, setUsers] = useState([])

  useEffect(() => {
    userService.getAll().then(setUsers)
  }, [])

  return (
    <UsersSection>
      <h2>users</h2>

      <UserHeader>
        <span>Name</span>
        <span>Username</span>
        <span>Blogs</span>
      </UserHeader>

      <UserGrid>
        {users.map((user) => (
          <UserRow key={user.id}>
            <UserLink to={`/users/${user.id}`}>{user.name}</UserLink>
            <UserName>{user.username}</UserName>
            <BlogCount>{user.blogs.length}</BlogCount>
          </UserRow>
        ))}
      </UserGrid>
    </UsersSection>
  )
}

export default Users
