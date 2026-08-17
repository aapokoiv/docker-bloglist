const baseUrl = '/api/users'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = async () => {
  const res = await fetch(baseUrl)

  if (!res.ok) {
    throw new Error('Failed to fetch users')
  }

  return await res.json()
}

export { token }
export default { getAll, setToken }
