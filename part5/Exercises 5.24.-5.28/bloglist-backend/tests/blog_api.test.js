const { test, describe, beforeEach, after } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const assert = require('assert')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./test_helper')

const api = supertest(app)

beforeEach(async () => {
  await Blog.deleteMany({})
  await User.deleteMany({})

  // Create a test user
  const { token, user } = await helper.createTestUserAndGetToken()
  helper.token = token
  helper.user = user

  for (let blog of helper.initialBlogs) {
    let blogObject = new Blog({ ...blog, user: user._id })
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
      .set('Authorization', `Bearer ${helper.token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(titles.includes('New Blog Post'))
  })

  test('creation fails with status 401 if token not provided', async () => {
    const newBlog = {
      title: 'No Token Blog',
      author: 'Anonymous',
      url: 'http://example.com/no-token',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
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
      .set('Authorization', `Bearer ${helper.token}`)
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
      .set('Authorization', `Bearer ${helper.token}`)
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
      .set('Authorization', `Bearer ${helper.token}`)
      .send(newBlog)
      .expect(400)
  })
})

describe('deletion of a blog', () => {
  test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${helper.token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1)

    const titles = blogsAtEnd.map(b => b.title)
    assert.ok(!titles.includes(blogToDelete.title))
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingBlog()

    await api
      .delete(`/api/blogs/${validNonExistingId}`)
      .set('Authorization', `Bearer ${helper.token}`)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '12345invalidid'

    await api
      .delete(`/api/blogs/${invalidId}`)
      .set('Authorization', `Bearer ${helper.token}`)
      .expect(400)
  })

})

describe('updating a blog', () => {
  test('succeeds in updating the likes of a blog', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToUpdate = blogsAtStart[0]

    const updatedBlogData = {
      title: blogToUpdate.title,
      author: blogToUpdate.author,
      url: blogToUpdate.url,
      likes: blogToUpdate.likes + 10
    }

    const response = await api
      .put(`/api/blogs/${blogToUpdate.id}`)
      .send(updatedBlogData)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(response.body.likes, blogToUpdate.likes + 10)
  })

  test('fails with status code 404 if blog does not exist', async () => {
    const validNonExistingId = await helper.nonExistingBlog()

    const updatedBlogData = { likes: 10 }
    await api
      .put(`/api/blogs/${validNonExistingId}`)
      .send(updatedBlogData)
      .expect(404)
  })

  test('fails with status code 400 if id is invalid', async () => {
    const invalidId = '12345invalidid'

    const updatedBlogData = { title: 'Invalid ID Blog' }
    await api
      .put(`/api/blogs/${invalidId}`)
      .send(updatedBlogData)
      .expect(400)
  })
})

after(async () => {
  await mongoose.connection.close()
})

