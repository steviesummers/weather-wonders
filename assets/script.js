document.addEventListener("DOMContentLoaded", function() {
    const API_KEY = '3df3d730412a2b772e4553b5ee49bf06';
    const searchForm = document.getElementById('searchForm');
    const cityInput = document.getElementById('cityInput');
    const currentWeatherSection = document.getElementById('currentWeather');
    const forecastSection = document.getElementById('forecast');
    const searchHistorySection = document.getElementById('searchHistory');
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  
    function saveToLocalStorage(cityName) {
      searchHistory.unshift(cityName);
      if (searchHistory.length > 5) {
        searchHistory.pop();
      }
      localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
      renderSearchHistory();
    }
  
    function renderSearchHistory() {
      searchHistorySection.innerHTML = '';
      searchHistory.forEach(city => {
        const button = document.createElement('button');
        button.textContent = city;
        button.addEventListener('click', function() {
          searchCity(city);
        });
        searchHistorySection.appendChild(button);
      });
    }
  
    function searchCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
    .then(response => {
      if (!response.ok) {
        throw new Error('City not found');
      }
      return response.json();
    })
    .then(data => {
      displayCurrentWeather(data);
      return fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`);
    })
    .then(response => response.json())
    .then(data => {
      displayForecast(data);
      saveToLocalStorage(city);
    })
    .catch(error => console.error('Error:', error));
}

  
    function displayCurrentWeather(data) {
      const { name, main, weather, wind } = data;
      const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
      const html = `
        <h2>${name}</h2>
        <img src="${iconUrl}" alt="${weather[0].description}">
        <p>Temperature: ${main.temp}°C</p>
        <p>Humidity: ${main.humidity}%</p>
        <p>Wind Speed: ${wind.speed} m/s</p>
      `;
      currentWeatherSection.innerHTML = html;
    }
  
    function displayForecast(data) {
      const forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00'));
      forecastSection.innerHTML = '';
      forecastData.forEach(item => {
        const { dt_txt, main, weather, wind } = item;
        const iconUrl = `http://openweathermap.org/img/w/${weather[0].icon}.png`;
        const html = `
          <div>
            <h3>${dt_txt.split(' ')[0]}</h3>
            <img src="${iconUrl}" alt="${weather[0].description}">
            <p>Temperature: ${main.temp}°C</p>
            <p>Humidity: ${main.humidity}%</p>
            <p>Wind Speed: ${wind.speed} m/s</p>
          </div>
        `;
        forecastSection.innerHTML += html;
      });
    }
  
    searchForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const cityName = cityInput.value.trim();
      if (cityName) {
        searchCity(cityName);
        cityInput.value = '';
      }
    });
  
    renderSearchHistory();
  });
  