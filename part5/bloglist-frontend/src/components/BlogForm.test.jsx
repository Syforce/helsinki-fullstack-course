import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

describe('BlogForm', () => {
    const createBlog = vi.fn()

    test('calls createBlog with correct details when submitted', async () => {
        render(<BlogForm createBlog={createBlog} />)

        const titleInput = screen.getByTestId('title-input')
        const authorInput = screen.getByTestId('author-input')
        const urlInput = screen.getByTestId('url-input')
        const submitButton = screen.getByText('create')

        await userEvent.type(titleInput, 'New Blog Title')
        await userEvent.type(authorInput, 'New Author')
        await userEvent.type(urlInput, 'http://new.com')
        await userEvent.click(submitButton)

        expect(createBlog).toHaveBeenCalledTimes(1)
        expect(createBlog).toHaveBeenCalledWith({
            title: 'New Blog Title',
            author: 'New Author',
            url: 'http://new.com'
        })
    })
})
