import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import NewBlogForm from './NewBlogForm.jsx'
import { useBlogStore } from '../store.js'

test('creates a blog with the entered data', async () => {
  const addBlog = vi.fn().mockResolvedValue()
  useBlogStore.setState((state) => ({
    actions: { ...state.actions, addBlog },
  }))

  render(
    <MemoryRouter>
      <NewBlogForm />
    </MemoryRouter>
  )

  const user = userEvent.setup()

  const title = screen.getByLabelText('title:')
  const author = screen.getByLabelText('author:')
  const url = screen.getByLabelText('url:')
  const submitButton = screen.getByText('create')

  await user.type(title, 'Adding a blog for test')
  await user.type(author, 'UserEvent user')
  await user.type(url, 'https://www.usertestblog.com')
  await user.click(submitButton)

  expect(addBlog).toHaveBeenCalledWith({
    title: 'Adding a blog for test',
    author: 'UserEvent user',
    url: 'https://www.usertestblog.com',
  })
})
