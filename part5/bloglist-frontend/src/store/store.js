import { configureStore } from '@reduxjs/toolkit'
import blogsReducer from './blogsSlice'
import notificationReducer from './notificationSlice'
import userReducer from './userSlice'
import usersReducer from './usersSlice'

const store = configureStore({
  reducer: {
    blogs: blogsReducer,
    notification: notificationReducer,
    user: userReducer,
    users: usersReducer,
  },
})

export default store

