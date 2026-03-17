const CountryList = ({ countries, showCountry }) => {
    return (
        <div>
            {countries.map(c => (
                <div key={c.cca3}>
                    {c.name.common}{' '}
                    <button onClick={() => showCountry(c)}>show</button>
                </div>
            ))}
        </div>
    )
}

export default CountryList
