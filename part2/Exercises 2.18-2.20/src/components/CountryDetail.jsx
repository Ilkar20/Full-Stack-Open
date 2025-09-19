const CountriesDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
        <p>Capital: {country.capital}</p>
        <p>Area: {country.area}</p>
        <h3>Languages</h3>
        <ul>    
            {Object.values(country.languages).map((language) => (
                <li key={language}>{language}</li>
            ))}
        </ul>
        <img 
            src={country.flags.png} 
            alt={`Flag of ${country.name.common}`}
            style={{ width: "150px", border: "1px solid #ccc" }}
        />
    </div>
  );
}

export default CountriesDetail;