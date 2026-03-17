import React, { createContext, useContext, useReducer } from 'react'

const NotificationContext = createContext()

const notificationReducer = (state, action) => {
    switch (action.type) {
        case 'SHOW':
            return { message: action.payload.message, type: action.payload.type }
        case 'HIDE':
            return { message: null, type: 'success' }
        default:
            return state
    }
}

export const NotificationProvider = ({ children }) => {
    const [notification, dispatch] = useReducer(notificationReducer, {
        message: null,
        type: 'success'
    })

    let timeoutId = null

    const showNotification = (message, type = 'success', duration = 5) => {
        if (timeoutId) clearTimeout(timeoutId)
        dispatch({ type: 'SHOW', payload: { message, type } })
        timeoutId = setTimeout(() => {
            dispatch({ type: 'HIDE' })
            timeoutId = null
        }, duration * 1000)
    }

    return (
        <NotificationContext.Provider value={{ notification, showNotification }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const useNotification = () => {
    const context = useContext(NotificationContext)
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider')
    }
    return context
}
