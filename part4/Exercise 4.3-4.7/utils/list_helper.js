const _ = require('lodash')

const dummy = (blogs) => {
  blogs.push(1)
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const total = likes.reduce((sum, item) => sum + item, 0)
  return total
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return null
  }

  let favorite = blogs[0]
  for (let i = 1; i < blogs.length; i++) {
    if (blogs[i].likes > favorite.likes) {
      favorite = blogs[i]
    }
  }
  return favorite
}

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const authorCounts = _.countBy(blogs, 'author')
  const maxAuthor = _.maxBy(Object.keys(authorCounts), author => authorCounts[author])

  return { author: maxAuthor, blogs: authorCounts[maxAuthor] }
}

const mostLikes = (blogs) => {
  if (blogs.length === 0) {
    return null
  }
  const grouped = _.groupBy(blogs, 'author')
  const likesByAuthor = _.mapValues(grouped, authorBlogs =>
    _.sumBy(authorBlogs, 'likes')
  )
  const maxAuthor = _.maxBy(Object.keys(likesByAuthor), author => likesByAuthor[author])

  return { author: maxAuthor, likes: likesByAuthor[maxAuthor] }

}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}