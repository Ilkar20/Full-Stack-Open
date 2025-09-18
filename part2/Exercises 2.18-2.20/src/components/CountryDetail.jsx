const CountriesDetail = ({ country }) => {
  return (
    <div>
      <h2>{country.name.common}</h2>
        <p>Capital: {country.capital ? country.capital[0] : "N/A"}</p>
        <p>Area: {country.area} km²</p>
        <h3>Languages:</h3>
        <ul>    
            {country.languages ? Object.values(country.languages).map((lang) => (
                <li key={lang}>{lang}</li>
            )) : <li>N/A</li>}
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