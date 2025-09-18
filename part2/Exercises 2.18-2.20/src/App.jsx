import { useEffect, useState } from "react";
import countriesService from "./services/countriesService";
import SearchForm from "./components/SearchForm";
import CountriesList from "./components/CountryList";
import CountryDetail from "./components/CountryDetail";

const App = () => {
  const [countries, setCountries] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    countriesService.getAllCountries().then((data) => setCountries(data));
    
  }, []);

  return (
    <div>
      <SearchForm query={query} onChange={(e) => setQuery(e.target.value)} />
      <CountriesList countries={countries} />
    </div>
  );
}

export default App;