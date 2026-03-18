import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'
import { showNotification } from './notificationSlice'

const sortByLikesDesc = (blogs) => [...blogs].sort((a, b) => b.likes - a.likes)

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {
    setBlogs(_state, action) {
      return sortByLikesDesc(action.payload)
    },
    appendBlog(state, action) {
      state.push(action.payload)
      return sortByLikesDesc(state)
    },
    updateBlog(state, action) {
      const updated = action.payload
      const next = state.map((b) => (b.id === updated.id ? updated : b))
      return sortByLikesDesc(next)
    },
    removeBlog(state, action) {
      const id = action.payload
      return state.filter((b) => b.id !== id)
    },
  },
})

export const { setBlogs, appendBlog, updateBlog, removeBlog } = blogsSlice.actions

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const createBlog = (blogObject) => {
  return async (dispatch) => {
    const created = await blogService.create(blogObject)
    dispatch(appendBlog(created))
    dispatch(showNotification(`a new blog '${created.title}' by ${created.author} added`, 'success'))
  }
}

export const likeBlog = (blog) => {
  return async (dispatch) => {
    const payload = {
      ...blog,
      likes: blog.likes + 1,
      user: typeof blog.user === 'string' ? blog.user : blog.user?.id,
    }
    const updated = await blogService.update(blog.id, payload)
    if (blog.user && typeof updated.user === 'string') {
      updated.user = blog.user
    }
    dispatch(updateBlog(updated))
  }
}

export const deleteBlog = (blog) => {
  return async (dispatch) => {
    await blogService.remove(blog.id)
    dispatch(removeBlog(blog.id))
    dispatch(showNotification(`Deleted '${blog.title}'`, 'success'))
  }
}

export const addComment = (blogId, comment) => {
  return async (dispatch, getState) => {
    const existing = getState().blogs.find((b) => b.id === blogId)
    const updated = await blogService.addComment(blogId, comment)
    if (existing?.user && typeof updated.user === 'string') {
      updated.user = existing.user
    }
    dispatch(updateBlog(updated))
  }
}

export default blogsSlice.reducer

