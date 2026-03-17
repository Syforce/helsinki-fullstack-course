import Filter from './components/Filter.jsx';
import PersonForm from './components/PersonForm.jsx';
import Persons from './components/Persons.jsx';
import { useState } from 'react';

const App = () => {
    const [persons, setPersons] = useState([
        { name: 'Arto Hellas', number: '040-123456' },
        { name: 'Ada Lovelace', number: '39-44-5323523' },
        { name: 'Dan Abramov', number: '12-43-234345' },
        { name: 'Mary Poppendieck', number: '39-23-6423122' }
    ])
    const [newName, setNewName] = useState('')
    const [newNumber, setNewNumber] = useState('')
    const [filter, setFilter] = useState('')

    const handleNameChange = (event) => {
        setNewName(event.target.value)
    }

    const handleNumberChange = (event) => {
        setNewNumber(event.target.value)
    }

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const addPerson = (event) => {
        event.preventDefault()

        const nameToAdd = newName.trim()
        const numberToAdd = newNumber.trim()

        if (nameToAdd === '' || numberToAdd === '') {
            return
        }

        const nameExists = persons.some(
            (person) => person.name.toLowerCase() === nameToAdd.toLowerCase()
        )
        if (nameExists) {
            alert(`${nameToAdd} is already added to phonebook`)
            return
        }

        const newPerson = { name: nameToAdd, number: numberToAdd }
        setPersons(persons.concat(newPerson))
        setNewName('')
        setNewNumber('')
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
            <Persons personsToShow={personsToShow} />
        </div>
    )
}

export default App
