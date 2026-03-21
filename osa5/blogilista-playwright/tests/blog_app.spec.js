const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, getBlogElement } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://127.0.0.1:3003/api/testing/reset')
    await request.post('http://127.0.0.1:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen',
      },
    })

    await page.goto('http://127.0.0.1:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
    await expect(page.getByLabel('username')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')

      await expect(page.getByText('Matti Luukkainen logged in', { exact: true })).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'mluukkai', 'wrong')

      await expect(page.getByText('wrong username/password')).toBeVisible()
      await expect(page.getByText('Matti Luukkainen logged in')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'mluukkai', 'salainen')
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, {
        title: 'Playwright in Action',
        author: 'QA Person',
        url: 'https://example.com/playwright',
      })

      await expect(page.locator('.blog').filter({ hasText: 'Playwright in Action QA Person' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, {
        title: 'Liked Blog',
        author: 'Tester',
        url: 'https://example.com/liked',
      })

      const blog = getBlogElement(page, 'Liked Blog')
      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'like' }).click()

      await expect(blog.getByText('likes 1')).toBeVisible()
    })

    test('the user who added a blog can delete it', async ({ page }) => {
      await createBlog(page, {
        title: 'Disposable Blog',
        author: 'Tester',
        url: 'https://example.com/disposable',
      })

      const blog = getBlogElement(page, 'Disposable Blog')
      page.on('dialog', dialog => dialog.accept())
      await blog.getByRole('button', { name: 'view' }).click()
      await blog.getByRole('button', { name: 'delete' }).click()

      await expect(page.locator('.blog').filter({ hasText: 'Disposable Blog' })).toHaveCount(0)
    })

    test('only the user who added a blog sees the delete button', async ({ page, request }) => {
      await createBlog(page, {
        title: 'Creator Only Delete',
        author: 'Tester',
        url: 'https://example.com/creator-only',
      })

      await request.post('http://127.0.0.1:3003/api/users', {
        data: {
          name: 'Other User',
          username: 'otheruser',
          password: 'salainen',
        },
      })

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'otheruser', 'salainen')

      const blog = getBlogElement(page, 'Creator Only Delete')
      await blog.getByRole('button', { name: 'view' }).click()

      await expect(blog.getByRole('button', { name: 'delete' })).toHaveCount(0)
    })

    test('blogs are ordered according to likes, most likes first', async ({ page }) => {
      await createBlog(page, {
        title: 'Least Liked',
        author: 'Tester',
        url: 'https://example.com/least',
      })
      await createBlog(page, {
        title: 'Most Liked',
        author: 'Tester',
        url: 'https://example.com/most',
      })
      await createBlog(page, {
        title: 'Middle Liked',
        author: 'Tester',
        url: 'https://example.com/middle',
      })

      const leastLiked = getBlogElement(page, 'Least Liked')
      const mostLiked = getBlogElement(page, 'Most Liked')
      const middleLiked = getBlogElement(page, 'Middle Liked')

      await leastLiked.getByRole('button', { name: 'view' }).click()
      await mostLiked.getByRole('button', { name: 'view' }).click()
      await middleLiked.getByRole('button', { name: 'view' }).click()

      await mostLiked.getByRole('button', { name: 'like' }).click()
      await expect(getBlogElement(page, 'Most Liked').getByText('likes 1')).toBeVisible()

      await mostLiked.getByRole('button', { name: 'like' }).click()
      await expect(getBlogElement(page, 'Most Liked').getByText('likes 2')).toBeVisible()

      await middleLiked.getByRole('button', { name: 'like' }).click()
      await expect(getBlogElement(page, 'Middle Liked').getByText('likes 1')).toBeVisible()

      const blogTitles = await page.locator('.blog').evaluateAll(blogs =>
        blogs.map(blog => blog.textContent)
      )

      expect(blogTitles[0]).toContain('Most Liked')
      expect(blogTitles[1]).toContain('Middle Liked')
      expect(blogTitles[2]).toContain('Least Liked')
    })
  })
})
