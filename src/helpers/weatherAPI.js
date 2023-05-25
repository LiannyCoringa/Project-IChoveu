// Remova os comentários a medida que for implementando as funções
const TOKEN = import.meta.env.VITE_TOKEN;

export const searchCities = async (term) => {
  const API = `http://api.weatherapi.com/v1/search.json?lang=pt&key=${TOKEN}&q=${term}`;
  const response = await fetch(API);
  const data = await response.json();
  if (data.length === 0) {
    return alert('Nenhuma cidade encontrada') && data;
  }
  return data;
};

export const getWeatherByCity = (cityURL) => {

};
