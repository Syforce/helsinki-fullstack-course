import { useDispatch, useSelector } from 'react-redux'
import { updateAnecdote } from '../reducers/anecdoteReducer'
import { showNotification } from '../reducers/notificationReducer'

const AnecdoteList = () => {
    const dispatch = useDispatch()
    const anecdotes = useSelector(state => state.anecdotes)
    const filter = useSelector(state => state.filter)

    const filteredAnecdotes = anecdotes.filter(anecdote =>
        anecdote.content.toLowerCase().includes(filter.toLowerCase())
    )
    const sortedAnecdotes = [...filteredAnecdotes].sort((a, b) => b.votes - a.votes)

    const vote = async (id) => {
        const anecdote = anecdotes.find(a => a.id === id)
        const updatedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
        await dispatch(updateAnecdote(id, updatedAnecdote))
        dispatch(showNotification(`you voted '${anecdote.content}'`, 5))
    }

    return (
        <div>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>{anecdote.content}</div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => vote(anecdote.id)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList
