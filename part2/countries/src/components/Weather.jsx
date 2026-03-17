const Weather = ({ weather, city }) => {
    const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`
    return (
        <div>
            <h3>Weather in {city}</h3>
            <p>temperature {weather.main.temp} Celsius</p>
            <img src={iconUrl} alt={weather.weather[0].description} />
            <p>wind {weather.wind.speed} m/s</p>
        </div>
    )
}

export default Weather
