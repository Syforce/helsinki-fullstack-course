import { useState, useEffect } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')
    const [notification, setNotification] = useState({ message: null, type: 'success' })

    useEffect(() => {
        personsService
            .getAll()
            .then(response => {
                setPersons(response.data)
            })
    }, [])

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type })
        setTimeout(() => {
            setNotification({ message: null, type: 'success' })
        }, 3000)
    }

    const handleNameChange = (event) => setNewName(event.target.value)
    const handleNumberChange = (event) => setNewNumber(event.target.value)
    const handleFilterChange = (event) => setFilter(event.target.value)

    const addPerson = (event) => {
        event.preventDefault()

        const existingPerson = persons.find(p => p.name === newName)

        if (existingPerson) {
            const confirmUpdate = window.confirm(
                `${newName} is already added to phonebook, replace the old number with a new one?`
            )
            if (confirmUpdate) {
                const updatedPerson = { ...existingPerson, number: newNumber }
                personsService
                    .update(existingPerson.id, updatedPerson)
                    .then(returnedPerson => {
                        setPersons(persons.map(p => p.id !== existingPerson.id ? p : returnedPerson))
                        setNewName('')
                        setNewNumber('')
                        showNotification(`Updated ${returnedPerson.name}`)
                    })
                    .catch(error => {
                        showNotification(error.response.data.error, 'error')
                        if (error.response.status === 404) {
                            setPersons(persons.filter(p => p.id !== existingPerson.id))
                        }
                    })
            }
        } else {
            const newPerson = { name: newName, number: newNumber }
            personsService
                .create(newPerson)
                .then(returnedPerson => {
                    setPersons(persons.concat(returnedPerson))
                    setNewName('')
                    setNewNumber('')
                    showNotification(`Added ${returnedPerson.name}`)
                })
                .catch(error => {
                    showNotification(error.response.data.error, 'error')
                })
        }
    }

    const deletePerson = (id) => {
        const person = persons.find(p => p.id === id)
        if (window.confirm(`Delete ${person.name}?`)) {
            personsService
                .remove(id)
                .then(() => {
                    setPersons(persons.filter(p => p.id !== id))
                    showNotification(`Deleted ${person.name}`)
                })
                .catch(() => {
                    showNotification(`Person '${person.name}' was already deleted from server`, 'error')
                    setPersons(persons.filter(p => p.id !== id))
                })
        }
    }

    const personsToShow = filter === ''
        ? persons
        : persons.filter(person =>
            person.name.toLowerCase().includes(filter.toLowerCase())
        )

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notification.message} type={notification.type} />
            <Filter filter={filter} handleFilterChange={handleFilterChange} />
            <h3>Add a new</h3>
            <PersonForm
                addPerson={addPerson}
                newName={newName}
                handleNameChange={handleNameChange}
                newNumber={newNumber}
                handleNumberChange={handleNumberChange}
            />
            <h3>Numbers</h3>
            <Persons personsToShow={personsToShow} deletePerson={deletePerson} />
        </div>
    )
}

export default App
