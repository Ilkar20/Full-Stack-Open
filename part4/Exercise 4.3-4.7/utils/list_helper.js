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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}