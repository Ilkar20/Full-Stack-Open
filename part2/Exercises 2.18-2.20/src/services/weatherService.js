import axios from "axios";

const API_KEY = import.meta.env.REACT_APP_WEATHER_API_KEY;
const Base_URL = "https://api.openweathermap.org/data/2.5/weather";

const getWeatherByCity = (city) => {
    const request = axios.get(`${Base_URL}?q=${city}&appid=${API_KEY}&units=metric`);
    return request.then((response) => response.data);
};

export default { getWeatherByCity };