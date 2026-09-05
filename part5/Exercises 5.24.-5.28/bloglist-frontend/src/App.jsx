import { useState, useEffect } from 'react'
import { Link, Route, Routes, useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()

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
      navigate('/')
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
    navigate('/')
  }

  const addBlog = async (blogObject) => {
    try {
      const createdBlog = await blogService.create(blogObject)
      setBlogs(currentBlogs => currentBlogs.concat(createdBlog))
      showNotification(`a new blog ${createdBlog.title} by ${createdBlog.author} added`, 'success')
    } catch (error) {
      console.error('Failed to create blog:', error)
      showNotification('Failed to create blog', 'error')
    }
  }

  const handleLike = async (id) => {
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

  const handleDelete = async (id) => {
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

  return (
    <div>
      <nav>
        <Link to="/" style={{ marginRight: '10px' }}>blogs</Link>
        {user === null
          ? <Link to="/login">login</Link>
          : <button onClick={handleLogout}>logout</button>}
      </nav>
      <Notification message = {notification.message} type={notification.type} />
      <Routes>
        <Route path="/" element={
          <>
            <h2>blogs</h2>
            {user && <Togglable buttonLabel="create new blog">
              <h2>Create new</h2>
              <BlogForm onBlogCreated={addBlog} />
            </Togglable>}
            {blogs.toSorted((a, b) => b.likes - a.likes)
              .map(blog =>
                <Blog
                  key={blog.id}
                  blog={blog}
                  handleLike={handleLike}
                  handleDelete={handleDelete}
                  currentUser={user} />
              )}
          </>
        } />
        <Route path="/login" element={
          <>
            <h2>Log in to application</h2>
            <LoginForm onLogin={handleLogin} />
          </>
        } />
      </Routes>
    </div>
  )
}

export default App