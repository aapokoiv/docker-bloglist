import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Blog from './Blog.jsx'
import { useAuthStore, useBlogStore } from '../store.js'

const blog = {
  id: 'blog-1',
  title: 'This is a testing blog',
  author: 'Aapo Koivula',
  url: 'www.testing.react',
  likes: 1,
  user: {
    id: 'user-1',
    name: 'Aapo Koivula',
    username: 'aapo',
  },
}

const renderBlog = (user = null) => {
  useBlogStore.setState({ blogs: [blog] })
  useAuthStore.setState({ user })

  render(
    <MemoryRouter initialEntries={['/blogs/blog-1']}>
      <Routes>
        <Route path="/blogs/:id" element={<Blog />} />
      </Routes>
    </MemoryRouter>
  )
}

test('all info but no buttons shown for not logged in users', () => {
  renderBlog()

  expect(screen.getByText('This is a testing blog')).toBeInTheDocument()
  expect(screen.getByText('By Aapo Koivula')).toBeInTheDocument()
  expect(screen.getByText('www.testing.react')).toBeInTheDocument()
  expect(screen.getByText('1 Likes')).toBeInTheDocument()
  expect(screen.queryByRole('button')).not.toBeInTheDocument()
})

test('like button but no delete button is shown for other users', () => {
  const loggedInUser = {
    id: 'user-2',
    name: 'onni onnekas',
    username: 'onni',
  }

  renderBlog(loggedInUser)

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.queryByRole('button', { name: 'delete' })).not.toBeInTheDocument()
})

test('blog creator is shown like and delete button', () => {
  const loggedInUser = {
    id: 'user-1',
    name: 'Aapo Koivula',
    username: 'aapo',
  }

  renderBlog(loggedInUser)

  expect(screen.getByRole('button', { name: 'like' })).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'delete' })).toBeInTheDocument()
})
