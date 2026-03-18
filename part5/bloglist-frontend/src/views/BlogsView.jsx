import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useRef } from 'react'
import Togglable from '../components/Togglable'
import BlogForm from '../components/BlogForm'
import { createBlog } from '../store/blogsSlice'
import { showNotification } from '../store/notificationSlice'

const BlogsView = () => {
  const blogs = useSelector((state) => state.blogs)
  const dispatch = useDispatch()
  const blogFormRef = useRef()

  const addBlog = async (blogObject) => {
    try {
      await dispatch(createBlog(blogObject))
      blogFormRef.current.toggleVisibility()
    } catch (error) {
      dispatch(showNotification('failed to add blog', 'error'))
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Togglable buttonLabel="create new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Togglable>
      <div className="list">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-list-item">
            <Link to={`/blogs/${blog.id}`}>{blog.title}</Link> {blog.author}
          </div>
        ))}
      </div>
    </div>
  )
}

export default BlogsView

