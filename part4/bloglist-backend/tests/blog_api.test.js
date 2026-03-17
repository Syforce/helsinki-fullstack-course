const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

let token
let userId

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const newUser = {
        username: 'testuser',
        name: 'Test User',
        password: 'password123'
    }
    await api.post('/api/users').send(newUser)

    const loginResponse = await api.post('/api/login').send({
        username: 'testuser',
        password: 'password123'
    })
    token = loginResponse.body.token

    const user = await User.findOne({ username: 'testuser' })
    userId = user._id.toString()

    const blogObjects = helper.initialBlogs.map(blog => ({
        ...blog,
        user: userId
    }))
    await Blog.insertMany(blogObjects)
})

describe('when there are initially some blogs saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        assert.strictEqual(response.body.length, helper.initialBlogs.length)
    })

    test('the unique identifier property is named id', async () => {
        const response = await api.get('/api/blogs')
        const blog = response.body[0]
        assert(blog.id !== undefined)
        assert(blog._id === undefined)
    })
})

describe('addition of a new blog', () => {
    test('succeeds with valid data and token', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'Test Author',
            url: 'http://example.com',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        assert(titles.includes('New Blog'))
    })

    test('fails with 401 if token not provided', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'Test Author',
            url: 'http://example.com',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)
    })

    test('likes default to 0 if missing', async () => {
        const newBlog = {
            title: 'No Likes Blog',
            author: 'Author',
            url: 'http://example.com/no-likes'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(201)

        assert.strictEqual(response.body.likes, 0)

        const blogsAtEnd = await helper.blogsInDb()
        const savedBlog = blogsAtEnd.find(b => b.title === 'No Likes Blog')
        assert.strictEqual(savedBlog.likes, 0)
    })

    test('fails with status 400 if title missing', async () => {
        const newBlog = {
            author: 'Author',
            url: 'http://example.com/no-title',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with status 400 if url missing', async () => {
        const newBlog = {
            title: 'No URL Blog',
            author: 'Author',
            likes: 5
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${token}`)
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})

describe('deletion of a blog', () => {
    test('succeeds with status 204 if user is creator', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)

        const titles = blogsAtEnd.map(b => b.title)
        assert(!titles.includes(blogToDelete.title))
    })

    test('fails with 401 if token missing', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(401)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with 403 if token belongs to different user', async () => {
        const anotherUser = {
            username: 'another',
            name: 'Another User',
            password: 'password123'
        }
        await api.post('/api/users').send(anotherUser)
        const loginAnother = await api.post('/api/login').send({
            username: 'another',
            password: 'password123'
        })
        const anotherToken = loginAnother.body.token

        const blogsAtStart = await helper.blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${anotherToken}`)
            .expect(403)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })

    test('fails with 404 if blog does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()

        await api
            .delete(`/api/blogs/${validNonexistingId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
    })
})

describe('updating a blog', () => {
    test('succeeds with valid data', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        const updatedData = {
            title: blogToUpdate.title,
            author: blogToUpdate.author,
            url: blogToUpdate.url,
            likes: blogToUpdate.likes + 100
        }

        const response = await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send(updatedData)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        assert.strictEqual(response.body.likes, blogToUpdate.likes + 100)

        const blogsAtEnd = await helper.blogsInDb()
        const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)
        assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 100)
    })

    test('fails with status 404 if id does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()
        const updatedData = {
            title: 'whatever',
            author: 'whoever',
            url: 'http://example.com',
            likes: 5
        }

        await api
            .put(`/api/blogs/${validNonexistingId}`)
            .send(updatedData)
            .expect(404)
    })
})

after(async () => {
    await mongoose.connection.close()
})
