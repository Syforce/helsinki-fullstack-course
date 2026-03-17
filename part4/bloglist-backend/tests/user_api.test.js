const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const mongoose = require('mongoose')
const app = require('../app')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
})

describe('user creation', () => {
    test('succeeds with a fresh username', async () => {
        const usersAtStart = await helper.usersInDb()

        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const usersAtEnd = await helper.usersInDb()
        assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

        const usernames = usersAtEnd.map(u => u.username)
        assert(usernames.includes(newUser.username))
    })

    test('fails with proper status code and message if username already taken', async () => {
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        await api
            .post('/api/users')
            .send(newUser)
            .expect(201)

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        assert(result.body.error.includes('expected `username` to be unique'))
    })

    test('fails if username is too short (<3)', async () => {
        const newUser = {
            username: 'ml',
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert(result.body.error.includes('is shorter than the minimum allowed length'))
    })

    test('fails if password is too short (<3)', async () => {
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
            password: 'sa',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert(result.body.error.includes('password must be at least 3 characters'))
    })

    test('fails if username missing', async () => {
        const newUser = {
            name: 'Matti Luukkainen',
            password: 'salainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert(result.body.error.includes('`username` is required'))
    })

    test('fails if password missing', async () => {
        const newUser = {
            username: 'mluukkai',
            name: 'Matti Luukkainen',
        }

        const result = await api
            .post('/api/users')
            .send(newUser)
            .expect(400)

        assert(result.body.error.includes('password must be at least 3 characters'))
    })
})

after(async () => {
    await mongoose.connection.close()
})
