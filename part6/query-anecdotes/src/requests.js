const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () =>
    fetch(baseUrl).then(res => {
        if (!res.ok) {
            throw new Error('Failed to fetch anecdotes')
        }
        return res.json()
    })

export const createAnecdote = (newAnecdote) =>
    fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAnecdote)
    }).then(res => {
        if (!res.ok) {
            throw new Error('Failed to create anecdote')
        }
        return res.json()
    })

export const updateAnecdote = (updatedAnecdote) =>
    fetch(`${baseUrl}/${updatedAnecdote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedAnecdote)
    }).then(res => {
        if (!res.ok) {
            throw new Error('Failed to update anecdote')
        }
        return res.json()
    })
