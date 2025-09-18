import axios from "axios";
const Base_URL = " https://studies.cs.helsinki.fi/restcountries/api/all";

const getAllCountries = () => {
  const request = axios.get(Base_URL);
  return request.then((response) => response.data);
};

const getByName = (name) => {
  const request = axios.get(`${Base_URL}/${name}`);
  return request.then((response) => response.data);
}

export default { getAllCountries };