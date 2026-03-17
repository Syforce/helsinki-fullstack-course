import { useState, useEffect } from 'react'
import personsService from './services/persons'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'

const App = () => {
    const [persons, setPersons] = useState([])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    useEffect(() => {
        personsService
            .getAll()
            .then(response => {
                setPersons(response.data)
            })
    }, [])

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
                    .then(response => {
                        setPersons(persons.map(p => p.id !== existingPerson.id ? p : response.data))
                        setNewName('')
                        setNewNumber('')
                    })
                    .catch(() => {
                        alert(`The person '${existingPerson.name}' was already deleted from server`)
                        setPersons(persons.filter(p => p.id !== existingPerson.id))
                    })
            }
        } else {
            const newPerson = { name: newName, number: newNumber }
            personsService
                .create(newPerson)
                .then(response => {
                    setPersons(persons.concat(response.data))
                    setNewName('')
                    setNewNumber('')
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
                })
                .catch(() => {
                    alert(`The person '${person.name}' was already deleted from server`)
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
