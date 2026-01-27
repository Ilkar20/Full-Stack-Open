import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import blogService from './services/blogs'
import loginService from './services/login'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState(null)
  const [notification, setNotification] = useState({ message: null, type: null })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')

    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const showNotification = (message, type='success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification({ message: null, type: null })
    }, 5000)
  }

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      showNotification(`Welcome back, ${user.name}!`, 'success')
    } catch (error) {
      console.error('Login failed:', error)
      alert('Invalid credentials')
      showNotification('Wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    blogService.setToken(null)
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(createdBlog))
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success')
    } catch (error) {
      console.error('Failed to create blog:', error)
      showNotification('Failed to create blog', 'error')
    }
  }

  const handleLike = (id) => async () => {
    const blog = blogs.find(b => b.id === id)
    const updatedBlogObject = {
      ...blog,
      likes: blog.likes + 1
    }

    try {
      await blogService.update(id, updatedBlogObject)
      setBlogs(blogs.map(b => b.id === id ? updatedBlogObject : b))
    } catch (error) {
      console.error('Error updating likes:', error)
      setNotification({ message: 'Failed to update likes', type: 'error' })
    }
  }

  const handleDelete = (id) => async () => {
    const blogDelete = blogs.find(b => b.id === id)

    if(window.confirm('Remove blog ' + blogDelete.title + ' by ' + blogDelete.author + '?'))
      try {
        await blogService.remove(id)
        setBlogs(blogs.filter(b => b.id !== id))
        showNotification('Blog deleted successfully', 'success')
      } catch (error) {
        console.error('Error deleting blog:', error)
        showNotification('Failed to delete blog', 'error')
      }
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message = {notification.message} type={notification.type} />
        <LoginForm onLogin={handleLogin} />
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message = {notification.message} type={notification.type} />
      <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
      <Togglable buttonLabel="create new blog">
        <h2>Create new</h2>
        <BlogForm onBlogCreated={addBlog} />
      </Togglable>
      {blogs.toSorted((a, b) => b.likes - a.likes)
        .map(blog =>
          <Blog
            key={blog.id}
            blog={blog}
            handleLike={handleLike}
            handleDelete={handleDelete}
            currentUser={user} />
        )}
    </div>
  )
}

export default App