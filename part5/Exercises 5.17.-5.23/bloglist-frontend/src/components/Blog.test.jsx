import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders blog title and author, but not url or likes', () => {

  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'http://example.com/testing-react',
    likes: 15,
    user: {
      name : 'Test User',
      username: 'testuser'
    }
  }


  const currentUser = {
    name: 'Test User',
    username: 'testuser'
  }

  const { container } = render(<Blog blog={blog} currentUser={currentUser}/>)

  const blogElement = container.querySelector('.blog-title-author')
  expect(blogElement).toHaveTextContent(
    'Testing React Components Test Author'
  )

  const urlElement = screen.queryByText('http://example.com/testing-react')
  const likesElement = screen.queryByText('likes 15')

  expect(urlElement).toBeNull()
  expect(likesElement).toBeNull()
})

test('shows url and likes when the view button is clicked', async () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'http://example.com/testing-react',
    likes: 15,
    user: {
      name : 'Test User',
      username: 'testuser'
    }
  }


  const currentUser = {
    name: 'Test User',
    username: 'testuser'
  }

  render(<Blog blog={blog} currentUser={currentUser}/>)
  const user = userEvent.setup()

  const button = screen.getByText('view')
  await user.click(button)

  const urlElement = screen.getByText('http://example.com/testing-react')
  const likesElement = screen.getByText('likes 15')

  expect(urlElement).toBeDefined()
  expect(likesElement).toBeDefined()
})

test('calls event handler twice when like button is clicked twice', async () => {
  const blog = {
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'http://example.com/testing-react',
    likes: 15,
    user: {
      name : 'Test User',
      username: 'testuser'
    }
  }


  const currentUser = {
    name: 'Test User',
    username: 'testuser'
  }

  const user = userEvent.setup()
  const mockHandler = vi.fn()

  render(<Blog blog={blog} handleLike={mockHandler} currentUser={currentUser}/>)

  const viewButton = screen.getByText('view')
  await user.click(viewButton)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler).toHaveBeenCalledTimes(2)
})