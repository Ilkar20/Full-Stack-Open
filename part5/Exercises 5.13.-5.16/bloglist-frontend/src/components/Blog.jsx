import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, currentUser }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const removeButtonStyle = {
    backgroundColor: '#788dd3', // A nice "danger" red
    color: 'black',
    border: 'none',
    padding: '5px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginTop: '5px'
  }

  const label = visible ? 'hide' : 'view'

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showRemoveButton = blog.user.username === currentUser.username

  return (
    <div style={blogStyle} className ="blog">
      <div className="blog-title-author">
        {blog.title} {blog.author}
        <button className="toggle-button" onClick={toggleVisibility}>{label}</button>
      </div>
      {visible && (
        <div className='blog-details'>
          <div>
            <a href={blog.url}>{blog.url}</a>
          </div>
          <div>
            likes {blog.likes}
            <button onClick={handleLike(blog.id)}>like</button>
          </div>
          <div>
            {blog.user.name}
          </div>
          {showRemoveButton && (
            <button
              style={removeButtonStyle}
              onClick={handleDelete(blog.id)}>
              remove
            </button>
          )}
        </div>
      )}
    </div>
  )}


export default Blog