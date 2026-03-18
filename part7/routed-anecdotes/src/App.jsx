import { useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import Menu from './components/Menu'
import AnecdoteList from './components/AnecdoteList'
import About from './components/About'
import CreateNew from './components/CreateNew'
import Anecdote from './components/Anecdote'
import Footer from './components/Footer'
import Notification from './components/Notification'

const App = () => {
    const [anecdotes, setAnecdotes] = useState([
        {
            content: 'If it hurts, do it more often',
            author: 'Jez Humble',
            info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
            votes: 0,
            id: 1
        },
        {
            content: 'Premature optimization is the root of all evil',
            author: 'Donald Knuth',
            info: 'http://wiki.c2.com/?PrematureOptimization',
            votes: 0,
            id: 2
        }
    ])

    const [notification, setNotification] = useState('')
    const navigate = useNavigate()

    const addNew = (anecdote) => {
        anecdote.id = Math.round(Math.random() * 10000)
        setAnecdotes(anecdotes.concat(anecdote))
        navigate('/')
        setNotification(`a new anecdote ${anecdote.content} created!`)
        setTimeout(() => setNotification(''), 5000)
    }

    const anecdoteById = (id) =>
        anecdotes.find(a => a.id === id)

    return (
        <div>
            <h1>Software anecdotes</h1>
            <Menu />
            <Notification message={notification} />
            <Routes>
                <Route path="/" element={<AnecdoteList anecdotes={anecdotes} />} />
                <Route path="/about" element={<About />} />
                <Route path="/create" element={<CreateNew addNew={addNew} />} />
                <Route path="/anecdotes/:id" element={<Anecdote anecdoteById={anecdoteById} />} />
            </Routes>
            <Footer />
        </div>
    )
}

export default App
