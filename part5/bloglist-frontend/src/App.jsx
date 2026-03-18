import Notification from './components/Notification'
import Navigation from './components/Navigation'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'
import { initializeBlogs } from './store/blogsSlice'
import { initializeUser } from './store/userSlice'
import { initializeUsers } from './store/usersSlice'
import LoginView from './views/LoginView'
import BlogsView from './views/BlogsView'
import UsersView from './views/UsersView'
import UserView from './views/UserView'
import BlogView from './views/BlogView'

const App = () => {
    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    useEffect(() => {
        dispatch(initializeUser())
    }, [dispatch])

    useEffect(() => {
        dispatch(initializeBlogs())
    }, [dispatch])

    useEffect(() => {
        if (!user) return
        dispatch(initializeUsers())
    }, [dispatch, user])

    if (!user) {
        return (
            <div className="container">
                <Notification />
                <LoginView />
            </div>
        )
    }

    return (
        <div className="container">
            <Navigation />
            <Notification />
            <Routes>
                <Route path="/" element={<BlogsView />} />
                <Route path="/users" element={<UsersView />} />
                <Route path="/users/:id" element={<UserView />} />
                <Route path="/blogs/:id" element={<BlogView />} />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    )
}

export default App
