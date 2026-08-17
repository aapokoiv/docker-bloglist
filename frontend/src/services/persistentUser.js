const getUser = () => {
  const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
  if (loggedUserJSON) return JSON.parse(loggedUserJSON)
}

const saveUser = (user) => {
  window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
}

const removeUser = () => {
  window.localStorage.removeItem('loggedBlogAppUser')
}

export default { getUser, saveUser, removeUser }
