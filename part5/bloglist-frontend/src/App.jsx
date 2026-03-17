import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState({ message: null, type: 'success' })

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    useEffect(() => {
        blogService.getAll().then(blogs =>
            setBlogs(blogs)
        )
    }, [])

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification({ message: null, type: 'success' })
        }, 5000)
    }

    const handleLogin = async (credentials) => {
        try {
            const user = await loginService.login(credentials)
            window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
            blogService.setToken(user.token)
            setUser(user)
            showNotification(`Welcome ${user.name}!`)
        } catch (exception) {
            showNotification('Wrong username or password', 'error')
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedBlogappUser')
        setUser(null)
        blogService.setToken(null)
    }

    const addBlog = async (blogObject) => {
        try {
            const returnedBlog = await blogService.create(blogObject)
            setBlogs(blogs.concat(returnedBlog))
            showNotification(`a new blog '${returnedBlog.title}' by ${returnedBlog.author} added`)
        } catch (exception) {
            showNotification('Failed to add blog', 'error')
        }
    }

    if (user === null) {
        return (
            <div>
                <Notification message={notification.message} type={notification.type} />
                <LoginForm handleLogin={handleLogin} />
            </div>
        )
    }

    return (
        <div>
            <Notification message={notification.message} type={notification.type} />
            <h2>blogs</h2>
            <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
            <BlogForm createBlog={addBlog} />
            {blogs.map(blog =>
                <Blog key={blog.id} blog={blog} />
            )}
        </div>
    )
}

export default App
