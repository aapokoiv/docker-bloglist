import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button, colors, Input } from './sharedStyles.js'
import { useBlogActions } from '../store.js'
import { useField } from '../hooks/index.js'

const PageSection = styled.div`
  background: ${colors.aliceBlue};
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 1rem;
  color: ${colors.charcoalBrown};
  margin: 2rem 0;
  max-width: 32rem;
  padding: 1.5rem;
`

const Form = styled.form`
  display: grid;
  gap: 1rem;
`

const FormGroup = styled.div`
  label {
    display: grid;
    font-weight: 700;
  }
`

const NewBlogForm = () => {
  const { addBlog } = useBlogActions()
  const navigate = useNavigate()
  const title = useField('title')
  const author = useField('author')
  const url = useField('url')

  const handleAdd = async (event) => {
    event.preventDefault()
    const newBlog = {
      title: title.value,
      author: author.value,
      url: url.value,
    }

    try {
      await addBlog(newBlog)
    } catch {
      return
    }
    navigate('/')
  }

  return (
    <PageSection>
      <h2>create new</h2>
      <Form onSubmit={handleAdd}>
        <FormGroup>
          <label>
            title:
            <Input {...title} />
          </label>
        </FormGroup>
        <FormGroup>
          <label>
            author:
            <Input {...author} />
          </label>
        </FormGroup>
        <FormGroup>
          <label>
            url:
            <Input {...url} />
          </label>
        </FormGroup>
        <Button type="submit">create</Button>
      </Form>
    </PageSection>
  )
}

export default NewBlogForm
