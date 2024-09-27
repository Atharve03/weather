const apiKey = "409652a5d589332b6106b2c2349b83b6";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const geoApiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&"; // API for coordinates
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherImg = document.querySelector(".weather img");

async function checkWeather(city) {
    try {
        const response = await fetch(`${apiUrl}${city}&appid=${apiKey}`);
        if (response.ok) {
            const data = await response.json();
            updateWeatherUI(data);
        } else {
            alert("City not found! Please try again.");
        }
    } catch (error) {
        console.log(error);
        alert("Error fetching weather data.");
    }
}

async function checkWeatherByCoordinates(lat, lon) {
    try {
        const response = await fetch(`${geoApiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}`);
        if (response.ok) {
            const data = await response.json();
            updateWeatherUI(data);
        } else {
            alert("Location not found! Please try again.");
        }
    } catch (error) {
        console.log(error);
        alert("Error fetching weather data.");
    }
}

function updateWeatherUI(data) {
    // Update text information
    document.querySelector(".city").innerHTML = data.name;
    document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
    document.querySelector(".description").innerHTML = data.weather[0].description;
    document.querySelector(".feels-like").innerHTML = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
    document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

    // Use OpenWeatherMap's weather icon
    const iconCode = data.weather[0].icon; // e.g., "04d" for clouds
    const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherImg.src = iconUrl;

    // Set dynamic background based on the main weather condition
    const weatherMain = data.weather[0].main.toLowerCase();
    let backgroundGradient;
    if (weatherMain === "clear") {
        backgroundGradient = "linear-gradient(to right, #00c9ff, #92fe9d)";
    } else if (weatherMain === "clouds") {
        backgroundGradient = "linear-gradient(to right, #757f9a, #d7dde8)";
    } else if (weatherMain === "rain" || weatherMain === "drizzle") {
        backgroundGradient = "linear-gradient(to right, #3a7bd5, #3a6073)";
    } else if (weatherMain === "snow") {
        backgroundGradient = "linear-gradient(to right, #e6dada, #274046)";
    } else if (weatherMain === "thunderstorm") {
        backgroundGradient = "linear-gradient(to right, #485563, #29323c)";
    } else {
        backgroundGradient = "linear-gradient(to right, #bdc3c7, #2c3e50)"; // Unknown or other weather
    }

    document.body.style.background = backgroundGradient;
}

// Get the user's current location
function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const lon = position.coords.longitude;
                checkWeatherByCoordinates(lat, lon);
            },
            (error) => {
                console.error(error);
                alert("Geolocation is not supported by this browser or permission denied.");
            }
        );
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

// Event listener for search button click
searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

// Fetch weather for the current location when the page loads
window.onload = function () {
    getLocation();
};
