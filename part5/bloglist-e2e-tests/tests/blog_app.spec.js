const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        await request.post('http://localhost:3003/api/testing/reset')
        await request.post('http://localhost:3003/api/users', {
            data: {
                username: 'testuser',
                name: 'Test User',
                password: 'password123'
            }
        })
        await page.goto('/')
    })

    test('Login form is shown', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
        await expect(page.getByText('username')).toBeVisible()
        await expect(page.getByText('password')).toBeVisible()
        await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
    })

    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.fill('input[name="Username"]', 'testuser')
            await page.fill('input[name="Password"]', 'password123')
            await page.click('button[type="submit"]')

            await expect(page.getByText('Test User logged in')).toBeVisible()
        })

        test('fails with wrong credentials', async ({ page }) => {
            await page.fill('input[name="Username"]', 'testuser')
            await page.fill('input[name="Password"]', 'wrong')
            await page.click('button[type="submit"]')

            const errorNotification = page.locator('.error')
            await expect(errorNotification).toBeVisible()
            await expect(errorNotification).toHaveText('Wrong username or password')
            await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()
        })
    })

    describe('When logged in', () => {
        beforeEach(async ({ page }) => {
            await page.fill('input[name="Username"]', 'testuser')
            await page.fill('input[name="Password"]', 'password123')
            await page.click('button[type="submit"]')
            await expect(page.getByText('Test User logged in')).toBeVisible()
        })

        test('a new blog can be created', async ({ page }) => {
            await page.click('button:has-text("create new blog")')

            await page.fill('input[data-testid="title-input"]', 'Test Blog')
            await page.fill('input[data-testid="author-input"]', 'Test Author')
            await page.fill('input[data-testid="url-input"]', 'http://test.com')
            await page.click('button:has-text("create")')

            await expect(page.locator('.success')).toHaveText('a new blog \'Test Blog\' by Test Author added')

            await expect(page.getByText('Test Blog Test Author')).toBeVisible()
        })

        test('a blog can be liked', async ({ page }) => {
            await page.click('button:has-text("create new blog")')
            await page.fill('input[data-testid="title-input"]', 'Like Test')
            await page.fill('input[data-testid="author-input"]', 'Author')
            await page.fill('input[data-testid="url-input"]', 'http://like.com')
            await page.click('button:has-text("create")')
            await expect(page.locator('.success')).toHaveText(/Like Test/)

            await page.click('button:has-text("view")')

            const likesText = await page.locator('.likes-count').textContent()
            const initialLikes = parseInt(likesText)

            await page.click('button:has-text("like")')

            await expect(page.locator('.likes-count')).toHaveText((initialLikes + 1).toString())
        })

        test('the user who added the blog can delete it', async ({ page }) => {
            await page.click('button:has-text("create new blog")')
            await page.fill('input[data-testid="title-input"]', 'Delete Test')
            await page.fill('input[data-testid="author-input"]', 'Author')
            await page.fill('input[data-testid="url-input"]', 'http://delete.com')
            await page.click('button:has-text("create")')
            await expect(page.locator('.success')).toHaveText(/Delete Test/)

            await page.click('button:has-text("view")')

            page.on('dialog', async dialog => {
                expect(dialog.message()).toContain('Remove blog Delete Test by Author?')
                await dialog.accept()
            })

            await page.click('button:has-text("remove")')

            await expect(page.getByText('Delete Test Author')).not.toBeVisible()
        })

        test('only the user who added the blog sees the delete button', async ({ page }) => {
            await page.click('button:has-text("create new blog")')
            await page.fill('input[data-testid="title-input"]', 'My Blog')
            await page.fill('input[data-testid="author-input"]', 'Me')
            await page.fill('input[data-testid="url-input"]', 'http://my.com')
            await page.click('button:has-text("create")')
            await expect(page.locator('.success')).toHaveText(/My Blog/)

            await page.click('button:has-text("view")')
            await expect(page.locator('button:has-text("remove")')).toBeVisible()

            await page.click('button:has-text("logout")')
            await expect(page.getByRole('heading', { name: 'Log in to application' })).toBeVisible()

            await page.request.post('http://localhost:3003/api/users', {
                data: {
                    username: 'another',
                    name: 'Another User',
                    password: 'password123'
                }
            })

            await page.fill('input[name="Username"]', 'another')
            await page.fill('input[name="Password"]', 'password123')
            await page.click('button[type="submit"]')
            await expect(page.getByText('Another User logged in')).toBeVisible()

            await expect(page.getByText('My Blog Me')).toBeVisible()
            await page.click('button:has-text("view")')
            await expect(page.locator('button:has-text("remove")')).not.toBeVisible()
        })

        test('blogs are sorted by likes, most likes first', async ({ page }) => {
            const response = await page.request.post('http://localhost:3003/api/login', {
                data: { username: 'testuser', password: 'password123' }
            })
            const { token } = await response.json()

            await page.request.post('http://localhost:3003/api/blogs', {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { title: 'Blog A', author: 'A', url: 'http://a.com', likes: 2 }
            })
            await page.request.post('http://localhost:3003/api/blogs', {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { title: 'Blog B', author: 'B', url: 'http://b.com', likes: 5 }
            })
            await page.request.post('http://localhost:3003/api/blogs', {
                headers: { 'Authorization': `Bearer ${token}` },
                data: { title: 'Blog C', author: 'C', url: 'http://c.com', likes: 1 }
            })

            await page.reload()

            const blogs = page.locator('.blog')
            await expect(blogs).toHaveCount(3)

            const firstBlog = blogs.nth(0)
            const secondBlog = blogs.nth(1)
            const thirdBlog = blogs.nth(2)

            await expect(firstBlog).toContainText('Blog B')
            await expect(secondBlog).toContainText('Blog A')
            await expect(thirdBlog).toContainText('Blog C')
        })
    })
})
