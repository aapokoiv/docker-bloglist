import axios from 'axios'
const baseUrl = '/api/blogs'
import { token } from './users.js'

const getAll = () => {
  const req = axios.get(baseUrl)
  return req.then((res) => res.data)
}

const createNew = async (newBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.post(baseUrl, newBlog, config)
  return req.data
}

const update = async (id, updatedBlog) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.put(`${baseUrl}/${id}`, updatedBlog, config)
  return req.data
}

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  }
  const req = await axios.delete(`${baseUrl}/${id}`, config)
  return req.data
}

export default { getAll, createNew, update, remove }
