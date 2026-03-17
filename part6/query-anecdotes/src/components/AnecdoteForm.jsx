import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNotification } from '../NotificationContext'
import { createAnecdote } from '../requests'

const AnecdoteForm = () => {
    const queryClient = useQueryClient()
    const { showNotification } = useNotification()

    const newAnecdoteMutation = useMutation({
        mutationFn: createAnecdote,
        onSuccess: (newAnecdote) => {
            queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
            showNotification(`a new anecdote '${newAnecdote.content}' created!`, 'success')
        },
        onError: (error) => {
            showNotification('too short anecdote, must have length 5 or more', 'error')
        }
    })

    const addAnecdote = async (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        event.target.anecdote.value = ''
        newAnecdoteMutation.mutate({ content, votes: 0 })
    }

    return (
        <div>
            <h2>create new</h2>
            <form onSubmit={addAnecdote}>
                <input name="anecdote" />
                <button type="submit">create</button>
            </form>
        </div>
    )
}

export default AnecdoteForm
