import CountryDetails from "./CountryDetail";

const CountriesList = ({ countries }) => {
    if ( countries.length === 0 ) {
        return <p>No matches found</p>;
    }

    if ( countries.length > 10 ) {
        return <p>Too many matches, specify another filter</p>;
    }

    if ( countries.length > 1 ) {
        return (
            <div>
                {countries.map((country) => (
                    <li key={country.cca3} style={{ margin: "0.5rem 0" }}>
                        {country.name.common}
                    </li>
                ))}
            </div>
        );
    }

    if ( countries.length === 1 ) {
        return <CountryDetails country={countries[0]} />;
    }

    return null;
}

export default CountriesList;

