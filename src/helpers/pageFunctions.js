import { searchCities, getWeatherByCity, forecast } from './weatherAPI';

/**
 * Cria um elemento HTML com as informações passadas
 */
function createElement(tagName, className, textContent = '') {
  const element = document.createElement(tagName);
  element.classList.add(...className.split(' '));
  element.textContent = textContent;
  return element;
}

/**
 * Recebe as informações de uma previsão e retorna um elemento HTML
 */
function createForecast(forecast) {
  const { date, maxTemp, minTemp, condition, icon } = forecast;

  const weekday = new Date(date);
  weekday.setDate(weekday.getDate() + 1);
  const weekdayName = weekday.toLocaleDateString('pt-BR', { weekday: 'short' });

  const forecastElement = createElement('div', 'forecast');
  const dateElement = createElement('p', 'forecast-weekday', weekdayName);

  const maxElement = createElement('span', 'forecast-temp max', 'max');
  const maxTempElement = createElement('span', 'forecast-temp max', `${maxTemp}º`);
  const minElement = createElement('span', 'forecast-temp min', 'min');
  const minTempElement = createElement('span', 'forecast-temp min', `${minTemp}º`);
  const tempContainer = createElement('div', 'forecast-temp-container');
  tempContainer.appendChild(maxElement);
  tempContainer.appendChild(minElement);
  tempContainer.appendChild(maxTempElement);
  tempContainer.appendChild(minTempElement);

  const conditionElement = createElement('p', 'forecast-condition', condition);
  const iconElement = createElement('img', 'forecast-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const middleContainer = createElement('div', 'forecast-middle-container');
  middleContainer.appendChild(tempContainer);
  middleContainer.appendChild(iconElement);

  forecastElement.appendChild(dateElement);
  forecastElement.appendChild(middleContainer);
  forecastElement.appendChild(conditionElement);

  return forecastElement;
}

/**
 * Limpa todos os elementos filhos de um dado elemento
 */
function clearChildrenById(elementId) {
  const citiesList = document.getElementById(elementId);
  while (citiesList.firstChild) {
    citiesList.removeChild(citiesList.firstChild);
  }
}

/**
 * Recebe uma lista de previsões e as exibe na tela dentro de um modal
 */
export function showForecast(forecastList) {
  const forecastContainer = document.getElementById('forecast-container');
  const weekdayContainer = document.getElementById('weekdays');
  clearChildrenById('weekdays');
  forecastList.forEach((forecast) => {
    const weekdayElement = createForecast(forecast);
    weekdayContainer.appendChild(weekdayElement);
  });

  forecastContainer.classList.remove('hidden');
}

/**
 * Recebe um objeto com as informações de uma cidade e retorna um elemento HTML
 */
export function createCityElement(cityInfo) {
  const { name, country, temp, condition, icon, url } = cityInfo;
  const cities = document.querySelector('#cities');

  const cityElement = createElement('li', 'city');

  const headingElement = createElement('div', 'city-heading');
  const nameElement = createElement('h2', 'city-name', name);
  const countryElement = createElement('p', 'city-country', country);
  headingElement.appendChild(nameElement);
  headingElement.appendChild(countryElement);

  const tempElement = createElement('p', 'city-temp', `${temp}º`);
  const conditionElement = createElement('p', 'city-condition', condition);

  const tempContainer = createElement('div', 'city-temp-container');
  tempContainer.appendChild(conditionElement);
  tempContainer.appendChild(tempElement);

  const iconElement = createElement('img', 'condition-icon');
  iconElement.src = icon.replace('64x64', '128x128');

  const buttonElement = createElement('button', 'city-forecast-button', 'Ver previsão');
  const infoContainer = createElement('div', 'city-info-container');
  infoContainer.appendChild(tempContainer);
  infoContainer.appendChild(iconElement);

  cityElement.appendChild(headingElement);
  cityElement.appendChild(infoContainer);
  cityElement.appendChild(buttonElement);
  cities.appendChild(cityElement);

  buttonElement.addEventListener('click', forecastFunction(url));

  return cityElement;
}

/**
 * Lida com o evento de submit do formulário de busca
 */
export function handleSearch(event) {
  event.preventDefault();
  clearChildrenById('cities');

  const searchInput = document.getElementById('search-input');
  const searchValue = searchInput.value;
  searchCities(searchValue)
    .then((res) => {
      if (typeof res === 'object') {
        res.forEach(async (obj) => {
          getWeatherByCity(obj.url);
          createCityElement(await getWeatherByCity(obj.url));
        });
      }
    });
}

export const forecastFunction = async (url) => {
  const forecastday = await forecast(url)
  const arrayRetorno = forecastday.map((obj) => {
    return {date: obj.date,
      maxTemp: obj.day.maxtemp_c,
      minTemp: obj.day.mintemp_c,
      condition: obj.day.condition.text,
      icon: obj.day.condition.icon};
  }); showForecast(arrayRetorno);
  return arrayRetorno;
}
// const button = document.querySelector('.city-forecast-button');
// button.addEventListener('click', async (event) => {
//   event.preventDefault();
//   event.target.classList = 'cityClick';
//   const cityClick = document.querySelector('.cityClick');
//   cityClick.parentNode.value
  // const searchInput = document.getElementById('search-input');
  // const searchValue = searchInput.value;
  // const retorno = await searchCities(searchValue);
  // const forestArray = forecast(cityURL)
  // const arrayRetorno = arrayForecast.map((obj) => {
  //   return {date: obj.date, maxTemp: obj.day.maxtemp_c, minTemp: obj.day.mintemp_c, condition: obj.day.condition.text, icon: obj.day.condition.icon};
//   })
//   showForecast(arrayRetorno);
// });



// const URL_CIDADE = retorno.url;
// const API_DAYS = `http://api.weatherapi.com/v1/forecast.json?lang=pt&key=${TOKEN}&q=${URL_CIDADE}&days=7`;
// const response = await fetch(API_DAYS);
// const data = await response.json();
// const arrayForecast = data.forecast.forecastday;