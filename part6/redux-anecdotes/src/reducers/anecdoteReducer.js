import { createSlice } from '@reduxjs/toolkit'

const anecdoteSlice = createSlice({
    name: 'anecdotes',
    initialState: [],
    reducers: {
        setAnecdotes(state, action) {
            return action.payload
        },
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        voteAnecdote(state, action) {
            const id = action.payload
            const anecdote = state.find(a => a.id === id)
            if (anecdote) {
                anecdote.votes += 1
            }
        }
    }
})

export const { setAnecdotes, appendAnecdote, voteAnecdote } = anecdoteSlice.actions

export const initializeAnecdotes = () => {
    return async dispatch => {
        const response = await fetch('http://localhost:3001/anecdotes')
        const data = await response.json()
        dispatch(setAnecdotes(data))
    }
}

export const createAnecdote = content => {
    return async dispatch => {
        const newAnecdote = {
            content,
            votes: 0,
            id: (Math.random() * 1000000).toFixed(0)
        }
        const response = await fetch('http://localhost:3001/anecdotes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newAnecdote)
        })
        const savedAnecdote = await response.json()
        dispatch(appendAnecdote(savedAnecdote))
    }
}

export const updateAnecdote = (id, newObject) => {
    return async dispatch => {
        await fetch(`http://localhost:3001/anecdotes/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newObject)
        })
        dispatch(voteAnecdote(id))
    }
}

export default anecdoteSlice.reducer
