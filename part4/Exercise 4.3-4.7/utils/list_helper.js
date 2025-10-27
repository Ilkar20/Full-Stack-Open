const dummy = (blogs) => {
  blogs.push(1)
  return 1
}

const totalLikes = (blogs) => {
  const likes = blogs.map(blog => blog.likes)
  const total = likes.reduce((sum, item) => sum + item, 0)
  return total
}

module.exports = {
  dummy,
  totalLikes
}