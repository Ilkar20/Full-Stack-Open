const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    const user = {
        name: 'Yilikaer Yihamujiang',
        username: 'Ilkar',
        password: 'Ilkar20000330'
      }
    await request.post('http://localhost:3003/api/users', { data: user })
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const pageText = page.getByText('Log in to application')
    await expect(pageText).toBeVisible()

    const loginForm = page.locator('#login-form')
    await expect(loginForm).toBeVisible()

    const loginButton = page.locator('#login-button')
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('Ilkar')
      await page.getByRole('textbox', { name: 'password' }).fill('Ilkar20000330')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Yilikaer Yihamujiang logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('Ilkar')
      await page.getByRole('textbox', { name: 'password' }).fill('wrongpassword')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await page.getByRole('textbox', { name: 'username' }).fill('Ilkar')
      await page.getByRole('textbox', { name: 'password' }).fill('Ilkar20000330')
      await page.getByRole('button', { name: 'login' }).click()
      await expect(page.getByText('Yilikaer Yihamujiang logged in')).toBeVisible()
    })

    test('A new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox', { name: 'title' }).fill('Test Blog')
      await page.getByRole('textbox', { name: 'author' }).fill('Ilkar')
      await page.getByRole('textbox', { name: 'url' }).fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await expect(page.getByText('Test Blog Ilkar')).toBeVisible()
    })

    test('A blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click() 
      await page.getByRole('textbox', { name: 'title' }).fill('Test Blog')
      await page.getByRole('textbox', { name: 'author' }).fill('Ilkar')
      await page.getByRole('textbox', { name: 'url' }).fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('The user who added a blog can delete it', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox', { name: 'title' }).fill('Test Blog')
      await page.getByRole('textbox', { name: 'author' }).fill('Ilkar')
      await page.getByRole('textbox', { name: 'url' }).fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()

      const blog = page.locator('.blog').filter({ hasText: `Test Blog Ilkar` })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toBeVisible()

      page.once('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'remove' }).click()
      await expect(blog).toHaveCount(0)
    })

    test('Only the user who added a blog sees the delete button', async ({ page, request }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await page.getByRole('textbox', { name: 'title' }).fill('Test Blog')
      await page.getByRole('textbox', { name: 'author' }).fill('Ilkar')
      await page.getByRole('textbox', { name: 'url' }).fill('http://testblog.com')
      await page.getByRole('button', { name: 'create' }).click()
      await page.getByRole('button', { name: 'logout' }).click()

      await request.post('http://localhost:3003/api/users', {
        data: {
          name: 'Another User',
          username: 'anotheruser',
          password: 'anotherpassword'
        }    
      })

      await page.getByRole('textbox', { name: 'username' }).fill('anotheruser')
      await page.getByRole('textbox', { name: 'password' }).fill('anotherpassword')
      await page.getByRole('button', { name: 'login' }).click()

      const blog = page.locator('.blog').filter({ hasText: `Test Blog Ilkar` })
      await blog.getByRole('button', { name: 'view' }).click()
      await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('Blogs are ordered according to likes in descending order', async ({ page }) => {
      const blogs = [
        { title: 'Blog 1', author: 'Author 1', url: 'http://blog1.com', likes: 0 },
        { title: 'Blog 2', author: 'Author 2', url: 'http://blog2.com', likes: 1 },
        { title: 'Blog 3', author: 'Author 3', url: 'http://blog3.com', likes: 2 }
      ]

      await page.getByRole('button', { name: 'create new blog' }).click()
      for (const blog of blogs) {
        await page.getByRole('textbox', { name: 'title' }).fill(blog.title)
        await page.getByRole('textbox', { name: 'author' }).fill(blog.author)
        await page.getByRole('textbox', { name: 'url' }).fill(blog.url)
        await page.getByRole('button', { name: 'create' }).click()
        await expect(page.getByText(`${blog.title} ${blog.author}`)).toBeVisible()
      }
      const blogElements = page.locator('.blog')

      for (const blogData of blogs) {
        const blog = blogElements.filter({
          hasText: `${blogData.title} ${blogData.author}`
        })
        await blog.getByRole('button', { name: 'view' }).click()

        for (let like = 1; like <= blogData.likes; like++) {
          await blog.getByRole('button', { name: 'like' }).click()
          await expect(blog).toContainText(`likes ${like}`)
        }
      }

      await expect(blogElements.nth(0)).toContainText('Blog 3 Author 3')
      await expect(blogElements.nth(1)).toContainText('Blog 2 Author 2')
      await expect(blogElements.nth(2)).toContainText('Blog 1 Author 1')
    })
  })
})
