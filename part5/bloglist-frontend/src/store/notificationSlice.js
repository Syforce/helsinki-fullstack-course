import { createSlice } from '@reduxjs/toolkit'

const initialState = { message: null, type: 'success' }

let clearTimeoutId

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action) {
      return action.payload
    },
    clearNotification() {
      return initialState
    },
  },
})

export const { setNotification, clearNotification } = notificationSlice.actions

export const showNotification = (message, type = 'success', seconds = 5) => {
  return (dispatch) => {
    dispatch(setNotification({ message, type }))
    if (clearTimeoutId) {
      clearTimeout(clearTimeoutId)
    }
    clearTimeoutId = setTimeout(() => {
      dispatch(clearNotification())
    }, seconds * 1000)
  }
}

export default notificationSlice.reducer

