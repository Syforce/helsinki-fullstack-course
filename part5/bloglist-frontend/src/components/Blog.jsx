import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
    const [visible, setVisible] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border: 'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    const handleLike = async () => {
        const updatedBlog = {
            ...blog,
            likes: blog.likes + 1,
            user: blog.user.id
        }
        await updateBlog(blog.id, updatedBlog)
    }

    const handleDelete = () => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
            deleteBlog(blog.id)
        }
    }

    const canDelete = user && blog.user && user.username === blog.user.username

    return (
        <div style={blogStyle} className="blog">
            <div className="blog-header">
                <span className="blog-title">{blog.title}</span> <span className="blog-author">{blog.author}</span>
                <button onClick={toggleVisibility} className="toggle-btn">
                    {visible ? 'hide' : 'view'}
                </button>
            </div>
            {visible && (
                <div className="blog-details">
                    <div className="blog-url">{blog.url}</div>
                    <div className="blog-likes">
                        likes <span className="likes-count">{blog.likes}</span>
                        <button onClick={handleLike} className="like-btn">like</button>
                    </div>
                    <div className="blog-user">{blog.user && blog.user.name}</div>
                    {canDelete && <button onClick={handleDelete} className="delete-btn">remove</button>}
                </div>
            )}
        </div>
    )
}

export default Blog
