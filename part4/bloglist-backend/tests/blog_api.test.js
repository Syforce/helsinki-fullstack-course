const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await Blog.deleteMany({})
    await Blog.insertMany(helper.initialBlogs)
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
    test('succeeds with valid data', async () => {
        const newBlog = {
            title: 'New Blog',
            author: 'Test Author',
            url: 'http://example.com',
            likes: 10
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

        const titles = blogsAtEnd.map(b => b.title)
        assert(titles.includes('New Blog'))
    })

    test('likes default to 0 if missing', async () => {
        const newBlog = {
            title: 'No Likes Blog',
            author: 'Author',
            url: 'http://example.com/no-likes'
        }

        const response = await api
            .post('/api/blogs')
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
            .send(newBlog)
            .expect(400)

        const blogsAtEnd = await helper.blogsInDb()
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
    })
})

after(async () => {
    await mongoose.connection.close()
})
