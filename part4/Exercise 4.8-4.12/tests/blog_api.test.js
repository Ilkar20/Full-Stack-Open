const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog(blog)
    await blogObject.save()
  }
})

describe('when there is initially some blogs saved', () => {
  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual((await helper.blogsInDb()).length, helper.initialBlogs.length)
  })

  test ('unique identifier property of the blog posts is named id', async () => {
    const response = await api.get('/api/blogs')

    const blogs = response.body
    blogs.forEach(blog => {
      assert.ok(blog.id)
    })
  })
})

describe('addition of a new blog', () => {
  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog Post',
      author: 'Test Author',
      url: 'http://example.com/new-blog-post',
      likes: 4
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('New Blog Post'))
  })
})

describe('blog post without likes property', () => {
  test('defaults to zero likes', async () => {
    const newBlog = {
      title: 'Blog Without Likes',
      author: 'No Likes Author',
      url: 'http://example.com/blog-without-likes'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, 0)
  })
})

describe('blog post without title and url', () => {
  test('fails with status 400 if title is missing ', async () => {
    const newBlog = {
      author: 'No Title Author',
      url: 'http://example.com/invalid-blog'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })

  test('fails with status 400 if url is missing ', async () => {
    const newBlog = {
      author: 'No URL Author',
      title: 'Invalid Blog'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})

