import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable.jsx'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [user, setUser] = useState(null)
    const [notification, setNotification] = useState({ message: null, type: 'success' })
    const blogFormRef = useRef()

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    useEffect(() => {
        blogService.getAll().then(blogs => {
            const sorted = blogs.sort((a, b) => b.likes - a.likes)
            setBlogs(sorted)
        })
    }, [])

    const updateBlog = async (id, updatedBlog) => {
        try {
            const returned = await blogService.update(id, updatedBlog)
            const existing = blogs.find(b => b.id === id)
            if (existing && existing.user && typeof returned.user === 'string') {
                returned.user = existing.user
            }
            setBlogs(blogs.map(b => b.id === id ? returned : b).sort((a, b) => b.likes - a.likes))
        } catch (exception) {
            showNotification(`Failed to update blog: ${exception.message}`, 'error')
        }
    }

    const deleteBlog = async (id) => {
        try {
            await blogService.remove(id)
            setBlogs(blogs.filter(b => b.id !== id))
        } catch (exception) {
            showNotification(`Failed to delete blog ${exception.message}`, 'error')
        }
    }

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
            showNotification(`Wrong username or password ${exception.message}`, 'error')
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
            blogFormRef.current.toggleVisibility()
            showNotification(`a new blog '${returnedBlog.title}' by ${returnedBlog.author} added`)
        } catch (exception) {
            showNotification(`Failed to add blog ${exception.message}`, 'error')
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
            <Togglable buttonLabel="create new blog" ref={blogFormRef}>
                <BlogForm createBlog={addBlog} />
            </Togglable>
            {blogs.map(blog =>
                <Blog
                    key={blog.id}
                    blog={blog}
                    updateBlog={updateBlog}
                    deleteBlog={deleteBlog}
                    user={user}
                />
            )}
        </div>
    )
}

export default App
