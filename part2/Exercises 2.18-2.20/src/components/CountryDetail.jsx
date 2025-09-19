import {useState, useEffect } from "react";
import weatherService from "../services/weatherService";

const CountriesDetail = ({ country }) => {

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (country.capital) {
      weatherService.getWeatherByCity(country.capital[0])
        .then((data) => {setWeather(data);
      });
    }
  }, [country]);


  return (
    <div>
      <h2>{country.name.common}</h2>
        <span>Capital: {country.capital}</span><br />
        <span>Area: {country.area}</span><br />
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
        {weather && (
          <div>
            <h3>Weather in {country.capital}</h3>
            <p>Temperature {weather.main.temp} Celsius</p>
            <img 
              src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              alt={weather.weather[0].description}
            />
            <p>Wind {weather.wind.speed} m/s</p>
          </div>
        )}

    </div>
  );
}

export default CountriesDetail;