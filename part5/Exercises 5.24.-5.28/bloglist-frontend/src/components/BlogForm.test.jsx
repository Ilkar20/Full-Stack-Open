import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('calls the event handler it received as props with the right details when a new blog is created', async () => {
  const onBlogCreated = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm onBlogCreated={onBlogCreated} />)

  const titleInput = screen.getByLabelText('Title:')
  const authorInput = screen.getByLabelText('Author:')
  const urlInput = screen.getByLabelText('URL:')

  await user.type(titleInput, 'Testing React Components')
  await user.type(authorInput, 'Test Author')
  await user.type(urlInput, 'http://example.com/testing-react')

  const submitButton = screen.getByText('Create')
  await user.click(submitButton)

  expect(onBlogCreated.mock.calls).toHaveLength(1)
  expect(onBlogCreated.mock.calls[0][0]).toEqual({
    title: 'Testing React Components',
    author: 'Test Author',
    url: 'http://example.com/testing-react'
  })
})