const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const User = require('../models/user')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
  const user = new User({ username: 'existinguser', name: 'Existing User', passwordHash: 'hashedpassword' })
  await user.save()
})

describe('user creation validation tests', () => {
  test('creation fails with proper statuscode and message if username is missing', async () => {
    const newUser = {
      name: 'No Username',
      password: 'validpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'Username, name, and password are required')
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('fails if username is not unique', async () => {
    const newUser = {
      username: 'existinguser',
      name: 'Duplicate User',
      password: 'validpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'Username must be unique')
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation fails with proper statuscode and message if password is missing', async () => {
    const newUser = {
      username: 'nousername',
      name: 'No Password'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'Username, name, and password are required')
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'validpassword'
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'Username must be at least 3 characters long')
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const newUser = {
      username: 'validusername',
      name: 'Short Password',
      password: 'pw'
    }
    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(result.body.error, 'Password must be at least 3 characters long')
    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 1)
  })

  test('creation succeeds with a valid username and password', async () => {
    const newUser = {
      username: 'validuser',
      name: 'Valid User',
      password: 'validpassword'
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await User.find({})
    assert.strictEqual(usersAtEnd.length, 2)
    const usernames = usersAtEnd.map(u => u.username)
    assert.ok(usernames.includes('validuser'))
  })
})

after(async () => {
  await mongoose.connection.close()
})