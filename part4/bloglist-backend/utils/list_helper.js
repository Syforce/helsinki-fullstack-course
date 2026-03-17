const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null
    return blogs.reduce((max, blog) => (blog.likes > max.likes ? blog : max))
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

    const authorCount = {}
    blogs.forEach(blog => {
        authorCount[blog.author] = (authorCount[blog.author] || 0) + 1
    })

    let maxAuthor = null
    let maxCount = 0
    for (const [author, count] of Object.entries(authorCount)) {
        if (count > maxCount) {
            maxCount = count
            maxAuthor = author
        }
    }

    return { author: maxAuthor, blogs: maxCount }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

    const authorLikes = {}
    blogs.forEach(blog => {
        authorLikes[blog.author] = (authorLikes[blog.author] || 0) + blog.likes
    })

    let maxAuthor = null
    let maxLikes = 0
    for (const [author, likes] of Object.entries(authorLikes)) {
        if (likes > maxLikes) {
            maxLikes = likes
            maxAuthor = author
        }
    }

    return { author: maxAuthor, likes: maxLikes }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}
