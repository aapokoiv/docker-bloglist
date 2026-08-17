import { useEffect } from 'react'
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Blog from './components/Blog.jsx'
import LoginForm from './components/LoginForm.jsx'
import NewBlogForm from './components/NewBlogForm.jsx'
import Notification from './components/Notification.jsx'
import BlogList from './components/BlogList.jsx'
import Users from './components/Users.jsx'
import User from './components/User.jsx'
import { Button, colors } from './components/sharedStyles.js'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { useBlogActions, useUser, useUserActions } from './store.js'

const AppShell = styled.div`
  background: #fff;
  color: ${colors.charcoalBrown};
  font-family: system-ui, sans-serif;
  min-height: 100vh;
  padding: 1.5rem;
`

const NavBar = styled.nav`
  align-items: center;
  background: ${colors.charcoalBrown};
  border-radius: 1rem;
  box-shadow: 0 0.4rem 0 ${colors.softBlossom};
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  padding: 0.75rem;
`

const NavLink = styled(Link)`
  border-radius: 999px;
  color: ${colors.aliceBlue};
  font-weight: 700;
  padding: 0.55rem 1rem;
  text-decoration: none;

  &:hover {
    background: ${colors.skyAqua};
    color: ${colors.charcoalBrown};
  }
`

const App = () => {
  const navigate = useNavigate()
  const { initializeBlogs } = useBlogActions()
  const { logout, initializeUser } = useUserActions()
  const user = useUser()

  useEffect(() => {
    initializeBlogs()
    initializeUser()
  }, [initializeBlogs, initializeUser])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <AppShell>
      <NavBar>
        <NavLink to="/">blogs</NavLink>
        {user && <NavLink to="/create">new blog</NavLink>}
        {!user && <NavLink to="/login">login</NavLink>}
        <NavLink to="/users">users</NavLink>
        {user && <Button onClick={() => handleLogout()}>logout</Button>}
      </NavBar>
      <Notification />

      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<BlogList />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="create" element={<NewBlogForm />} />
          <Route path="blogs/:id" element={<Blog />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<User />} />
          <Route path="*" element={<h2>404 - Page not found</h2>} />
        </Routes>
      </ErrorBoundary>
    </AppShell>
  )
}

export default App
