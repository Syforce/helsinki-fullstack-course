import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('Blog component', () => {
    const blog = {
        title: 'Test Blog',
        author: 'Test Author',
        url: 'http://test.com',
        likes: 5,
        user: {
            username: 'testuser',
            name: 'Test User'
        }
    }

    const mockUpdateBlog = vi.fn()
    const mockDeleteBlog = vi.fn()
    const user = { username: 'testuser' } // logged-in user (creator)

    test('renders title and author, but not url or likes by default', () => {
        render(<Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} user={user} />)

        const title = screen.getByText('Test Blog')
        const author = screen.getByText('Test Author')
        const url = screen.queryByText('http://test.com')
        const likes = screen.queryByText('5')

        expect(title).toBeDefined()
        expect(author).toBeDefined()
        expect(url).toBeNull()
        expect(likes).toBeNull()
    })

    test('shows url and likes when view button is clicked', async () => {
        render(<Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} user={user} />)

        const viewButton = screen.getByText('view')
        await userEvent.click(viewButton)

        const url = screen.getByText('http://test.com')
        const likesLabel = screen.getByText('likes')
        const likesCount = screen.getByText('5')

        expect(url).toBeDefined()
        expect(likesLabel).toBeDefined()
        expect(likesCount).toBeDefined()
    })

    test('clicking like button twice calls event handler twice', async () => {
        render(<Blog blog={blog} updateBlog={mockUpdateBlog} deleteBlog={mockDeleteBlog} user={user} />)

        const viewButton = screen.getByText('view')
        await userEvent.click(viewButton)

        const likeButton = screen.getByText('like')
        await userEvent.click(likeButton)
        await userEvent.click(likeButton)

        expect(mockUpdateBlog).toHaveBeenCalledTimes(2)
    })
})
