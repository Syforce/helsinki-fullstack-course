import { useParams } from 'react-router-dom'

const Anecdote = ({ anecdoteById }) => {
    const id = Number(useParams().id)
    const anecdote = anecdoteById(id)

    if (!anecdote) return null

    return (
        <div>
            <h2>{anecdote.content} by {anecdote.author}</h2>
            <p>has {anecdote.votes} votes</p>
            <p>for more info see <a href={anecdote.info}>{anecdote.info}</a></p>
        </div>
    )
}

export default Anecdote
