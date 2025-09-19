import { useEffect, useState } from "react";
import countriesService from "./services/countriesService";
import SearchForm from "./components/SearchForm";
import CountriesList from "./components/CountryList";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [allCountries, setAllCountries] = useState([]);
  const [query, setQuery] = useState("");

  
  useEffect(() => {
    countriesService.getAllCountries().then(all => setAllCountries(all));
  }, []);

  
  useEffect(() => {
    if (query) {
      const filtered = allCountries.filter(country =>
        country.name.common.toLowerCase().includes(query.toLowerCase())
      );
      setCountries(filtered);
    } else {
      setCountries([]);
    }
  }, [query, allCountries]);

  return (
    <div>
      <SearchForm query={query} onChange={(e) => setQuery(e.target.value)} />
      <CountriesList countries={countries} />
    </div>
  );
}

export default App;