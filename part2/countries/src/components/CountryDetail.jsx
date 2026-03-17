import { useState, useEffect } from 'react'
import axios from 'axios'
import Weather from './Weather'

const CountryDetail = ({ country }) => {
    const [weather, setWeather] = useState(null)

    useEffect(() => {
        setWeather(null)
        const api_key = import.meta.env.VITE_WEATHER_API_KEY
        if (!api_key) {
            console.error('Weather API key missing')
            return
        }
        const capital = country.capital?.[0] || country.capital
        if (!capital) return

        axios
            .get(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(capital)}&APPID=${api_key}&units=metric`)
            .then(response => setWeather(response.data))
            .catch(err => console.error('Weather fetch failed', err))
    }, [country])

    return (
        <div>
            <h2>{country.name.common}</h2>
            <p>capital {country.capital?.[0] || country.capital}</p>
            <p>area {country.area}</p>
            <h3>languages:</h3>
            <ul>
                {country.languages && Object.values(country.languages).map(lang => (
                    <li key={lang}>{lang}</li>
                ))}
            </ul>
            <img src={country.flags.png} alt={`flag of ${country.name.common}`} width="150" />
            {weather && <Weather weather={weather} city={country.capital?.[0] || country.capital} />}
        </div>
    )
}

export default CountryDetail
