const express = require('express')
const app = express()
const PORT = 3001
app.use(express.json())

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const count = persons.length
    const time = new Date()
    res.send(`
    <p>Phonebook has info for ${count} people</p>
    <p>${time}</p>
  `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(p => p.id === id)
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const initialLength = persons.length
    persons = persons.filter(p => p.id !== id)

    if (persons.length < initialLength) {
        res.status(204).end()
    } else {
        res.status(404).end()
    }
})

app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name || !body.number) {
        return res.status(400).json({ error: 'name or number missing' })
    }

    const existing = persons.find(p => p.name === body.name)
    if (existing) {
        return res.status(400).json({ error: 'name must be unique' })
    }

    const newPerson = {
        id: Math.floor(Math.random() * 1000000).toString(),
        name: body.name,
        number: body.number
    }

    persons = persons.concat(newPerson)
    res.json(newPerson)
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
