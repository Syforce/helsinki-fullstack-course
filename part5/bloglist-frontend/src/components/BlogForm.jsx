import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addBlog = (event) => {
        event.preventDefault()
        createBlog({
            title,
            author,
            url,
        })
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addBlog} className="blog-form">
                <div>
                    title:
                    <input
                        type="text"
                        value={title}
                        onChange={({ target }) => setTitle(target.value)}
                        data-testid="title-input"
                    />
                </div>
                <div>
                    author:
                    <input
                        type="text"
                        value={author}
                        onChange={({ target }) => setAuthor(target.value)}
                        data-testid="author-input"
                    />
                </div>
                <div>
                    url:
                    <input
                        type="text"
                        value={url}
                        onChange={({ target }) => setUrl(target.value)}
                        data-testid="url-input"
                    />
                </div>
                <button type="submit" className="create-btn">create</button>
            </form>
        </div>
    )
}

export default BlogForm
