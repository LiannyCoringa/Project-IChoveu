const TOKEN = import.meta.env.VITE_TOKEN;

export const searchCities = async (term) => {
  const API = `http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`;
  const response = await fetch(API);
  const data = await response.json();
  if (data.length === 0) {
    return window.alert('Nenhuma cidade encontrada');
  }
  return data;
};

export const getWeatherByCity = async (cityURL) => {
  const API_CITY = `http://api.weatherapi.com/v1/current.json?lang=pt&key=${TOKEN}&q=${cityURL}`;
  const response = await fetch(API_CITY);
  const data = await response.json();
  const tempo = {
    name: data.location.name,
    country: data.location.country,
    temp: data.current.temp_c,
    condition: data.current.condition.text,
    icon: data.current.condition.icon,
    url: cityURL,
  };
  return tempo;
};

export const forecast = async (cityURL) => {
  const API_DAYS = `http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${TOKEN}&q=${cityURL}&days=7`;
  const response = await fetch(API_DAYS);
  const data = await response.json();
  const arrayForecast = data.forecast.forecastday;
  return arrayForecast;
}
