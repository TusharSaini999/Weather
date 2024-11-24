// Initialize the map and set the view to the user's location or a default position
const map = L.map('map').setView([20.5937, 90.9629], 10); // Default view over India

// Add the OpenStreetMap base layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Weather API Key
const apiKey = '080f31b85b696163705270e96865ae9a';

// Temperature and Pressure layers from OpenWeatherMap
const tempLayer = L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    attribution: 'Weather data &copy; <a href="https://openweathermap.org/">OpenWeatherMap</a>',
    opacity: 0.5
});

const pressureLayer = L.tileLayer(`https://tile.openweathermap.org/map/pressure_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
    opacity: 0.5
});



// Handle checkbox changes to ensure only one layer is shown at a time
const tempCheckbox = document.getElementById('tempCheckbox');
const pressureCheckbox = document.getElementById('pressureCheckbox');

// Event listener for Temperature radio button
tempCheckbox.addEventListener('change', () => {
    if (tempCheckbox.checked) {
        map.addLayer(tempLayer);
        map.removeLayer(pressureLayer);  // Remove pressure layer
    }
});

// Event listener for Pressure radio button
pressureCheckbox.addEventListener('change', () => {
    if (pressureCheckbox.checked) {
        map.addLayer(pressureLayer);
        map.removeLayer(tempLayer);  // Remove temperature layer
    }
});

// Get the user's location and center map on it
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
        const { latitude, longitude } = position.coords;
        map.setView([latitude, longitude], 8);

        // Marker for user location
        L.marker([latitude, longitude]).addTo(map)
            .bindPopup("You are here!")
            .openPopup();

        // Fetch weather data for the user's location
        fetchWeatherData(latitude, longitude);
    });
} else {
    console.log("Geolocation is not supported by this browser.");
}

// Function to fetch weather data for user's location and update right-side panel
function fetchWeatherData(lat, lon) {
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            
            const pressure = data.main.pressure;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;

            // Update the weather info in the right-side panel
            
            document.getElementById('pressure').textContent = pressure;
            document.getElementById('humidity').textContent = humidity;
            document.getElementById('wind-speed').textContent = windSpeed;

            // Show the weather info panel
            document.getElementById('weather-info').style.display = 'block';
        })
        .catch(error => console.error('Error fetching weather data:', error));
}

// Add the search input control to the map
const geocoder = L.Control.Geocoder.nominatim();
L.Control.geocoder({
    query: '',
    placeholder: 'Search for a location...',
    collapsed: false,
    geocoder: geocoder
}).addTo(map);

// Listen to the search results and fetch weather data accordingly
map.on('geocodingsearch', function(event) {
    const lat = event.latlng.lat;
    const lon = event.latlng.lng;

    // Center map on the searched location
    map.setView([lat, lon], 10);

    // Fetch weather data for the searched location
    fetchWeatherData(lat, lon);
});
