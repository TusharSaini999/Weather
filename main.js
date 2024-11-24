/* Devloped by Tushar Saini*/

const apiKey = process.env.MY_SECRET;
let p=document.getElementById("er");
let pt=document.getElementById("et");

async function getWeather() {
       const city = document.getElementById('cityInput').value;
    
    if(city=="") {
        p.textContent="Please Enter City Name.";
    }
    else {
    p.textContent='';
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            p.textContent= "HTTP Error, Server Down";
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (data.cod === '404') {
            p.textContent="City Not Find or Spelling mistake in City"
            return;
        }
        displayWeather(data);
        getThreeDayForecast(data.coord.lat, data.coord.lon);
    } catch (error) {
        console.error('Failed to fetch weather data:', error);
        p.textContent="Failed to fetch weather data Or City not Find or Spelling Mistake of City";
    }
    }
}






function getLocation() {
       pt.innerHTML="";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(getWeatherForLocation, showError);
    } else {
        p.textContent="Geolocation is not supported by this browser.";
    }
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            pt.innerHTML="<div id='myModal' class='modal'><div class='modal-content'><div class='modal-header'><h2>Location</h2><span class='close'>&times;</span></div><div class='modal-body'><b><p>Please enable your location. If you wish to check the weather, click on the 'Enable location' button.</p></b><p>This popup window has appeared again! Click on the close icon to close the window. To fetch the weather, search by city name. You can also fetch weather by location. For instructions, click on <a href='https://support.google.com/chrome/answer/142065?hl=en&co=GENIE.Platform%3DDesktop'>Read</a>.</p></div><div class='modal-footer'><button class='btn btn-primary' onclick='getLocation()'>Enable Location</button></div></div></div>";
            var modal = document.getElementById("myModal");
            var span = document.getElementsByClassName("close")[0];
            span.onclick = function() {
                modal.style.display = "none";
            }
            break;
        case error.POSITION_UNAVAILABLE:
            p.textContent="Location information is unavailable.";
            break;
        case error.TIMEOUT:
            p.textContent="The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            p.textContent="An unknown error occurred.";
            break;
    }
}
function getWeatherForLocation(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            getThreeDayForecast(lat, lon);
        })
        .catch(error => console.error('Error fetching weather data:', error));
        p.textContent='';
}





async function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

            try {
                const response = await fetch(url);
                if (!response.ok) {
                p.textContent= "HTTP Error, Server Down";
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                displayWeather(data);
                getThreeDayForecast(lat, lon);
            } catch (error) {
                console.error('Failed to fetch weather data:', error);
                p.textContent="Failed to fetch weather data";
            }
        }, error => {
            p.textContent="Unable to retrieve your location";
            console.error('Geolocation error:', error);
        });
    } else {
        p.textContent="Geolocation is not supported by your browser";
    }
    p.textContent='';
}






function getEmojiForDescription(description) {
    const weatherDescriptions = {
        'clear sky': '☀️',
        'few clouds': '🌤️',
        'scattered clouds': '⛅',
        'overcast clouds' : '🌥️',
        'broken clouds': '☁️',
        'shower rain': '🌧️',
        'light rain' : '💧',
        'rain': '🌧️',
        'thunderstorm': '⛈️',
        'snow': '❄️',
        'mist': '🌫️'
    };

    return weatherDescriptions[description.toLowerCase()] || '';
}

function getUVIndex(lat, lon) {
    const uvUrl = `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    return fetch(uvUrl)
        .then(response => response.json())
        .then(data => data.value);
}

function getAirQuality(lat, lon) {


    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;


    return fetch(airQualityUrl)

        .then(response => response.json())

        .then(data =>data.list[0].components.pm2_5 ); // AQI is within 'main' property of the first item in the 'list' array

}

function displayWeather(data) {
       pt.innerHTML="";
   const description = data.weather[0].description;
    const emoji = getEmojiForDescription(description); document.getElementById('city').textContent = data.name;
    
const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeString = currentDate.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12 :true});
    const feelsLikeTemp = data.main.feels_like;
   const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: true });
        
    const visibilityKm = (data.visibility / 1000).toFixed(2);
     document.getElementById('emoji').textContent = `${emoji}`;
document.getElementById('description').textContent = `${description}`;
    document.getElementById('temperature').textContent = `${data.main.temp} °C`;
   document.getElementById('date').textContent = `Date: ${dateString}`;
   document.getElementById('time').textContent = `Time :${timeString}`;
   document.getElementById('sr').textContent = `Sunrise🌅: ${sunriseTime}`;
    document.getElementById('ss').textContent = `Sunset🌇: ${sunsetTime}`;
    document.getElementById('humidity').textContent = `${data.main.humidity} %  Humidity`;
    document.getElementById('windSpeed').textContent = `${data.wind.speed} m/s  Wind Speed`;
    document.getElementById('clouds').textContent = `${data.clouds.all} %  Cloudiness`;
    document.getElementById('feel').textContent = `${feelsLikeTemp} °C Feel Like`;
    
document.getElementById('pressure').textContent = `${data.main.pressure} hPa  Air Pressure`;

 // Fetch and display UV index
    getUVIndex(data.coord.lat, data.coord.lon).then(uvIndex => {
document.getElementById('uv').textContent = `${uvIndex} UV Index`;
styleFirstWord('#uv');
});
      // Fetch and display air quality
    getAirQuality(data.coord.lat, data.coord.lon).then(aqi => {
        document.getElementById('air').textContent = `${aqi} Air Quality`;
        styleFirstWord('#air');
    });
    
    document.getElementById('vis').textContent = `${visibilityKm} Km Visibility`;
    
styleFirstWord('#humidity');
styleFirstWord('#windSpeed');
styleFirstWord('#clouds');
styleFirstWord('#pressure');
styleFirstWord('#vis');
styleFirstWord('#feel');
p.textContent='';
}








async function getThreeDayForecast(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
            p.textContent= "HTTP Error, Server Down";
        }
        const data = await response.json();
        displayThreeDayForecast(data.list);
    } catch (error) {
        console.error('Failed to fetch 5-day forecast data:', error);
        p.textContent="Failed to fetch 5-day forecast data";
    }
}







function displayThreeDayForecast(forecastList) {
    const forecastContainer = document.getElementById('forecast');
    forecastContainer.innerHTML = ''; // Clear previous content

    // Create an object to store daily forecast data
    const dailyData = {};

    forecastList.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

        // If this date is not already in the dailyData object, add it
        if (!dailyData[date]) {
            dailyData[date] = {
                temp: [],
                weather: [],
                description: [],
                cloudiness: []
            };
        }

        // Add the temperature and weather info to the dailyData object
        dailyData[date].temp.push(item.main.temp);
        dailyData[date].weather.push(item.weather[0].main);
        dailyData[date].description.push(item.weather[0].description);
        dailyData[date].cloudiness.push(item.clouds.all);
    });

    // Filter out today's date
    const currentDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const dates = Object.keys(dailyData).filter(date => date !== currentDate);

    // Limit to 3 days (or 3 unique dates)
    const uniqueDates = new Set(dates.slice(0, 5));

    // Iterate over unique dates
    uniqueDates.forEach(date => {
        const dayData = dailyData[date];

        // Calculate the average temperature and cloudiness for the day
        const avgTemp = (dayData.temp.reduce((a, b) => a + b) / dayData.temp.length).toFixed(2);
        const mtemp = (avgTemp - 273.15).toFixed(2);

        const avgCloudiness = (dayData.cloudiness.reduce((a, b) => a + b) / dayData.cloudiness.length).toFixed(2);

        const descriptionCounts = {};
        dayData.description.forEach(desc => {
            descriptionCounts[desc] = (descriptionCounts[desc] || 0) + 1;
        });
        const mostFrequentDescription = Object.keys(descriptionCounts).reduce((a, b) => descriptionCounts[a] > descriptionCounts[b] ? a : b);

        const emojiMapping = {
            'clear sky': '☀️',
            'few clouds': '🌤️',
            'scattered clouds': '⛅',
            'overcast clouds': '🌥️',
            'broken clouds': '☁️',
            'shower rain': '🌧️',
            'light rain': '💧',
            'rain': '🌧️',
            'thunderstorm': '⛈️',
            'snow': '❄️',
            'mist': '🌫️'
        };
        const emoji = emojiMapping[mostFrequentDescription] || '';

        // Create forecast item element
        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <br><p>${date}</p>
            <p>${mostFrequentDescription} ${emoji}</p>
            <p>Temperature: ${mtemp} °C</p>
            <p>Cloudiness: ${avgCloudiness} %</p><br>
        `;

        // Append forecast item to forecast container
        forecastContainer.appendChild(forecastItem);
    });
}








function styleFirstWord(selector) {
        document.querySelectorAll(selector).forEach(element => {
            let words = element.textContent.split(" ");
            if (words.length > 0) {
                words[0] = `<span style="font-weight:bold;font-size:30px">${words[0]}</span>`;
                element.innerHTML = words.join(" ");
            }
        });
    }
    
    
    
getLocation();
