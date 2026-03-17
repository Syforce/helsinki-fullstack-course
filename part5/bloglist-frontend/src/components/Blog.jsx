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
            <div>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
            </div>
            {visible && (
                <div>
                    <div>{blog.url}</div>
                    <div>
                        likes {blog.likes}
                        <button onClick={handleLike}>like</button>
                    </div>
                    <div>{blog.user && blog.user.name}</div>
                    {canDelete && <button onClick={handleDelete}>remove</button>}
                </div>
            )}
        </div>
    )
}

export default Blog
