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
})