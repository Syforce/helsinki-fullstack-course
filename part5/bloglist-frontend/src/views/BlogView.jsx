import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addComment, deleteBlog, likeBlog } from '../store/blogsSlice'
import { useState } from 'react'
import { showNotification } from '../store/notificationSlice'

const BlogView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const blog = useSelector((state) => state.blogs.find((b) => b.id === id))
  const user = useSelector((state) => state.user)
  const [comment, setComment] = useState('')

  if (!blog) {
    return null
  }

  const canDelete = user && blog.user && user.username === blog.user.username

  const handleLike = async () => {
    try {
      await dispatch(likeBlog(blog))
    } catch (error) {
      dispatch(showNotification('failed to like blog', 'error'))
    }
  }

  const handleDelete = async () => {
    if (!window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) return
    try {
      await dispatch(deleteBlog(blog))
      navigate('/')
    } catch (error) {
      dispatch(showNotification('failed to delete blog', 'error'))
    }
  }

  const handleAddComment = async (event) => {
    event.preventDefault()
    const value = comment.trim()
    if (!value) return
    try {
      await dispatch(addComment(blog.id, value))
      setComment('')
    } catch (error) {
      dispatch(showNotification('failed to add comment', 'error'))
    }
  }

  return (
    <div className="blog-view">
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes} <button onClick={handleLike}>like</button>
      </div>
      <div>added by {blog.user?.name}</div>
      {canDelete && <button onClick={handleDelete}>remove</button>}

      <h3>comments</h3>
      <form onSubmit={handleAddComment}>
        <input value={comment} onChange={(e) => setComment(e.target.value)} />
        <button type="submit">add comment</button>
      </form>
      <ul>
        {(blog.comments ?? []).map((c, index) => (
          <li key={`${blog.id}-comment-${index}`}>{c}</li>
        ))}
      </ul>
    </div>
  )
}

export default BlogView

