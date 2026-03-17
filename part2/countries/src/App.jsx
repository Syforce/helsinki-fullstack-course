import { useState, useEffect } from 'react'
import axios from 'axios'
import CountryList from './components/CountryList'
import CountryDetail from './components/CountryDetail'

const App = () => {
    const [countries, setCountries] = useState([])
    const [filter, setFilter] = useState('')

    useEffect(() => {
        axios
            .get('https://studies.cs.helsinki.fi/restcountries/api/all')
            .then(response => {
                setCountries(response.data)
            })
    }, [])

    const handleFilterChange = (event) => {
        setFilter(event.target.value)
    }

    const showCountry = (country) => {
        setFilter(country.name.common)
    }

    const filterValue = filter.trim().toLowerCase()
    const filtered = filterValue
        ? countries.filter((c) => c.name.common.toLowerCase().includes(filterValue))
        : []

    let content = <p>Start typing to search for countries</p>

    if (filterValue && filtered.length > 10) {
        content = <p>Too many matches, specify another filter</p>
    } else if (filterValue && filtered.length > 1 && filtered.length <= 10) {
        content = <CountryList countries={filtered} showCountry={showCountry} />
    } else if (filterValue && filtered.length === 1) {
        content = <CountryDetail country={filtered[0]} />
    } else if (filterValue && filtered.length === 0) {
        content = <p>No countries match the filter</p>
    }

    return (
        <div>
            <h2>Country Info</h2>
            <div>
                find countries <input value={filter} onChange={handleFilterChange} />
            </div>
            {content}
        </div>
    )
}

export default App
