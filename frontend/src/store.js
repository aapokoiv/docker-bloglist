import { create } from 'zustand'
import loginService from './services/login.js'
import blogService from './services/blogs.js'
import persistentUserService from './services/persistentUser.js'
import userService from './services/users.js'

let notificationTimer

const getErrorMessage = (error, fallback) => error?.response?.data?.error || fallback

export const useNotificationStore = create((set) => ({
  message: null,
  type: '',
  actions: {
    setNotification: ({ message, type }) => {
      clearTimeout(notificationTimer)
      set({ message, type })
      notificationTimer = setTimeout(() => {
        set({ message: null, type: '' })
      }, 5000)
    },
  },
}))

export const useMessage = () => useNotificationStore((state) => state.message)

export const useMessageType = () => useNotificationStore((state) => state.type)

export const useNotificationActions = () => useNotificationStore((state) => state.actions)

export const useAuthStore = create((set) => ({
  user: null,
  actions: {
    login: async (credentials) => {
      try {
        const user = await loginService.login(credentials)
        console.log(`got user ${user}`)
        persistentUserService.saveUser(user)
        set({ user: user })
        userService.setToken(user.token)
        useNotificationStore.getState().actions.setNotification({
          message: 'Logged in successfully',
          type: 'success',
        })
      } catch (error) {
        useNotificationStore.getState().actions.setNotification({
          message: 'wrong username or password',
          type: 'error',
        })
        throw error
      }
    },
    logout: () => {
      persistentUserService.removeUser()
      set({ user: null })
    },
    initializeUser: () => {
      const loggedUser = persistentUserService.getUser()
      if (loggedUser) {
        set({ user: loggedUser })
        userService.setToken(loggedUser.token)
      }
    },
  },
}))

export const useUser = () => useAuthStore((state) => state.user)
export const useUserActions = () => useAuthStore((state) => state.actions)

export const useBlogStore = create((set) => ({
  blogs: [],
  actions: {
    addBlog: async (content) => {
      try {
        const addedBlog = await blogService.createNew(content)
        const user = useAuthStore.getState().user
        const blogWithUser = {
          ...addedBlog,
          user: {
            id: user.id,
            username: user.username,
            name: user.name,
          },
        }
        set((state) => ({ blogs: state.blogs.concat(blogWithUser) }))
        useNotificationStore.getState().actions.setNotification({
          message: `Added: '${content.title}' by '${content.author}'`,
          type: 'success',
        })
      } catch (error) {
        useNotificationStore.getState().actions.setNotification({
          message: getErrorMessage(error, 'Failed adding blog'),
          type: 'error',
        })
      }
    },
    updateBlog: async (id, newContent) => {
      try {
        const updatedBlog = await blogService.update(id, newContent)
        set((state) => ({
          blogs: state.blogs.map((b) => (b.id === id ? { ...updatedBlog, user: b.user } : b)),
        }))
        useNotificationStore.getState().actions.setNotification({
          message: `Liked: ${newContent.title}`,
          type: 'success',
        })
      } catch (error) {
        useNotificationStore.getState().actions.setNotification({
          message: getErrorMessage(error, 'Failed updating blog'),
          type: 'error',
        })
      }
    },
    deleteBlog: async (id) => {
      const { setNotification } = useNotificationStore.getState().actions
      try {
        await blogService.remove(id)
        set((state) => ({ blogs: state.blogs.filter((b) => b.id !== id) }))
        setNotification({ message: 'Deleted successfully', type: 'success' })
      } catch (error) {
        setNotification({
          message: getErrorMessage(error, 'Failed deleting blog'),
          type: 'error',
        })
        throw error
      }
    },
    initializeBlogs: async () => {
      const blogs = await blogService.getAll()
      set({ blogs: blogs })
    },
  },
}))

export const useBlogs = () => useBlogStore((state) => state.blogs)
export const useBlogActions = () => useBlogStore((state) => state.actions)
