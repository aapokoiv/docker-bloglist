import styled from 'styled-components'
import { useMessage, useMessageType } from '../store.js'

const noticeColors = {
  error: {
    background: '#fde2e2',
    border: '#c92a2a',
    text: '#8a1c1c',
  },
  success: {
    background: '#ddf7df',
    border: '#2f9e44',
    text: '#1f6f30',
  },
}

const Notice = styled.div`
  background: ${({ type }) => noticeColors[type]?.background || '#eeeeee'};
  border: 2px solid ${({ type }) => noticeColors[type]?.border || '#777777'};
  border-radius: 0.9rem;
  color: ${({ type }) => noticeColors[type]?.text || '#333333'};
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
  padding: 1rem;
`

const Notification = () => {
  const message = useMessage()
  const type = useMessageType()
  if (message === null) return null

  return <Notice type={type}>{message}</Notice>
}

export default Notification
