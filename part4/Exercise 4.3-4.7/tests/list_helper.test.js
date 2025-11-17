const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// Dummy test to ensure test framework is set up correctly
describe('dummy function', () => {
  test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

// Total likes test
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]

  const listWithMultipleBlogs = [
    {
      _id: '5a422a851b54a676234d17f7',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7,
      __v: 0
    },
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    },
    {
      _id: '5a422b3a1b54a676234d17f9',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12,
      __v: 0
    },
    {
      _id: '5a422b891b54a676234d17fa',
      title: 'First class tests',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
      likes: 10,
      __v: 0
    },
    {
      _id: '5a422ba71b54a676234d17fb',
      title: 'TDD harms architecture',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
      likes: 0,
      __v: 0
    },
    {
      _id: '5a422bc61b54a676234d17fc',
      title: 'Type wars',
      author: 'Robert C. Martin',
      url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
      likes: 2,
      __v: 0
    }
  ]

  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([])
    assert.strictEqual(result, 0)
  })

  test('when list has only one blog, equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(listWithMultipleBlogs)
    const expected = listWithMultipleBlogs.reduce((sum, blog) => sum + blog.likes, 0)
    assert.strictEqual(result, expected)
  })
})

// Favorite blog tests
describe('favorite blog', () => {
  const blogs = [
    {
      id: '1',
      title: 'React patterns',
      author: 'Michael Chan',
      url: 'https://reactpatterns.com/',
      likes: 7
    },
    {
      id: '2',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5
    },
    {
      id: '3',
      title: 'Canonical string reduction',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
      likes: 12
    }
  ]

  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('when list has one blog, it is the favorite', () => {
    const one = [blogs[0]]
    assert.deepStrictEqual(listHelper.favoriteBlog(one), blogs[0])
  })

  test('of a bigger list is the one with most likes', () => {
    const expected = blogs[2]
    assert.deepStrictEqual(listHelper.favoriteBlog(blogs), expected)
  })
})

describe('most blogs', () => {
  test('when list is empty, return null', () => {
    const result = listHelper.mostBlogs([])
    assert.strictEqual(result, null)
  })

  test('when list has multiple blogs, return the author with most blogs', () => {
    const list = [
      {
        title: 'React patterns',
        author: 'Michael Chan',
        likes: 7
      },
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      },
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      },
      {
        title: 'First class tests',
        author: 'Robert C. Martin',
        likes: 10
      },
      {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        likes: 0
      },
      {
        title: 'Type wars',
        author: 'Robert C. Martin',
        likes: 2
      }
    ]

    const result = listHelper.mostBlogs(list)

    const expected = {
      author: 'Robert C. Martin',
      blogs: 3
    }

    assert.deepStrictEqual(result, expected)
  })
})

describe('most likes', () => {
  test('of empty list is null', () => {
    const result = listHelper.mostLikes([])
    assert.strictEqual(result, null)
  })

  test('author with most total likes is returned', () => {
    const blogs = [
      {
        title: 'React patterns',
        author: 'Michael Chan',
        likes: 7
      },
      {
        title: 'Go To Statement Considered Harmful',
        author: 'Edsger W. Dijkstra',
        likes: 5
      },
      {
        title: 'Canonical string reduction',
        author: 'Edsger W. Dijkstra',
        likes: 12
      },
      {
        title: 'First class tests',
        author: 'Robert C. Martin',
        likes: 10
      },
      {
        title: 'TDD harms architecture',
        author: 'Robert C. Martin',
        likes: 0
      },
      {
        title: 'Type wars',
        author: 'Robert C. Martin',
        likes: 2
      }
    ]

    const result = listHelper.mostLikes(blogs)

    const expected = {
      author: 'Edsger W. Dijkstra',
      likes: 17   // 5 + 12
    }

    assert.deepStrictEqual(result, expected)
  })
})

