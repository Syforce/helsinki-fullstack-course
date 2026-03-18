import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import { showNotification } from './notificationSlice'

const STORAGE_KEY = 'loggedBlogappUser'

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(_state, action) {
      return action.payload
    },
    clearUser() {
      return null
    },
  },
})

export const { setUser, clearUser } = userSlice.actions

export const initializeUser = () => {
  return (dispatch) => {
    const loggedUserJSON = window.localStorage.getItem(STORAGE_KEY)
    if (!loggedUserJSON) return
    const user = JSON.parse(loggedUserJSON)
    blogService.setToken(user.token)
    dispatch(setUser(user))
  }
}

export const loginUser = (credentials) => {
  return async (dispatch) => {
    const user = await loginService.login(credentials)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    blogService.setToken(user.token)
    dispatch(setUser(user))
    dispatch(showNotification(`Welcome ${user.name}!`, 'success'))
  }
}

export const logoutUser = () => {
  return (dispatch) => {
    window.localStorage.removeItem(STORAGE_KEY)
    blogService.setToken(null)
    dispatch(clearUser())
  }
}

export default userSlice.reducer

