import { useState } from 'react'

const Blog = ({ blog, handleLike }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const label = visible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>{label}</button>
      </div>
      {visible && (
      <div>
        <div>
          <a href={blog.url}>{blog.url}</a>
          </div>
        <div>
          likes {blog.likes} 
          <button onClick={handleLike(blog.id)}>like</button></div>
        <div>{blog.user.name}</div>
      </div>
      )}
  </div>
)}


export default Blog