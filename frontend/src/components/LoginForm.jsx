import { useField } from '../hooks/index.js'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { Button, colors, Input } from './sharedStyles.js'
import { useUserActions } from '../store.js'

const Form = styled.form`
  background: ${colors.aliceBlue};
  border: 2px solid ${colors.charcoalBrown};
  border-radius: 1rem;
  color: ${colors.charcoalBrown};
  display: grid;
  gap: 1rem;
  margin: 2rem 0;
  max-width: 26rem;
  padding: 1.5rem;
`

const FormGroup = styled.div`
  label {
    display: grid;
    font-weight: 700;
  }
`

const LoginForm = () => {
  const username = useField('username')
  const password = useField('password')
  const navigate = useNavigate()
  const { login } = useUserActions()

  const handleLogin = async (event) => {
    event.preventDefault()
    const credentials = { username: username.value, password: password.value }
    try {
      await login(credentials)
      navigate('/')
    } catch {
      return
    }
  }

  return (
    <Form onSubmit={handleLogin}>
      <FormGroup>
        <label>
          username
          <Input {...username} />
        </label>
      </FormGroup>
      <FormGroup>
        <label>
          password
          <Input {...password} />
        </label>
      </FormGroup>
      <Button type="submit">login</Button>
    </Form>
  )
}

export default LoginForm
