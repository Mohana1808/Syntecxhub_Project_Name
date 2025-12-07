import React, { useState, useEffect } from "react";
import "./App.css";

const WeatherApp = () => {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const API_KEY = "";

  // Fetch weather on component mount (geolocation)
  useEffect(() => {
    fetchWeatherByLocation();
  }, []);

  // Get current position and fetch weather
  const fetchWeatherByLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const response = await fetch(
              `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`
            );
            const data = await response.json();
            if (data.length > 0) {
              fetchWeather(data[0].name);
            }
          } catch (err) {
            fetchWeather(""); // Default city
          }
        },
        () => {
          fetchWeather(""); // Default city if geolocation fails
        }
      );
    }
  };

  const fetchWeather = async (cityName) => {
    if (!cityName) return;
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`
      );
      const data = await response.json();
      if (data.cod !== 200) {
        throw new Error(data.message);
      }
      setWeather(data);
      setCity(cityName);
    } catch (err) {
      setWeather(null);
      setError(err.message || "City not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (city.trim()) {
      fetchWeather(city);
    }
  };

  return (
    <div className="weather-app-container">
      {/* Background */}
      <div className="weather-background"></div>

      {/* Main Content */}
      <div className="weather-app">
        {/* Header */}
        <div className="weather-header">
          <h1>🌤️ Weather App</h1>
          <p>Get Real-Time Weather Updates</p>
        </div>

        {/* Search Section */}
        <form className="search-section" onSubmit={handleSearch}>
          <div className="search-container">
            <input
              type="text"
              placeholder="Enter city name (e.g., Delhi, London, New York)"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="search-btn">
              <span>🔍 Search</span>
            </button>
          </div>
        </form>

        {/* Loading State */}
        {loading && <div className="loading-spinner">Loading...</div>}

        {/* Error Message */}
        {error && <div className="error-message">❌ {error}</div>}

        {/* Weather Display Card */}
        {weather && !loading && (
          <div className="weather-card">
            {/* Top Section - City & Time */}
            <div className="weather-header-card">
              <div>
                <h2 className="city-name">{weather.name}</h2>
                <p className="country">{weather.sys.country}</p>
              </div>
              <div className="time-display">
                <p>{new Date().toLocaleTimeString()}</p>
              </div>
            </div>

            {/* Middle Section - Temperature & Icon */}
            <div className="weather-main">
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`}
                alt={weather.weather[0].description}
                className="weather-icon"
              />
              <div className="temperature-section">
                <div className="temperature">
                  {Math.round(weather.main.temp)}
                  <span className="degree">°C</span>
                </div>
                <p className="weather-description">
                  {weather.weather[0].main}
                </p>
                <p className="weather-desc-detail">
                  {weather.weather[0].description.toUpperCase()}
                </p>
              </div>
            </div>

            {/* Feels Like */}
            <div className="feels-like">
              <p>Feels like <strong>{Math.round(weather.main.feels_like)}°C</strong></p>
            </div>

            {/* Divider */}
            <hr className="divider" />

            {/* Bottom Section - Details Grid */}
            <div className="weather-details">
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <div className="detail-content">
                  <p className="detail-label">Humidity</p>
                  <p className="detail-value">{weather.main.humidity}%</p>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">💨</span>
                <div className="detail-content">
                  <p className="detail-label">Wind Speed</p>
                  <p className="detail-value">{weather.wind.speed} m/s</p>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">🔽</span>
                <div className="detail-content">
                  <p className="detail-label">Pressure</p>
                  <p className="detail-value">{weather.main.pressure} hPa</p>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">👁️</span>
                <div className="detail-content">
                  <p className="detail-label">Visibility</p>
                  <p className="detail-value">{(weather.visibility / 1000).toFixed(1)} km</p>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">☁️</span>
                <div className="detail-content">
                  <p className="detail-label">Cloudiness</p>
                  <p className="detail-value">{weather.clouds.all}%</p>
                </div>
              </div>

              <div className="detail-item">
                <span className="detail-icon">↗️</span>
                <div className="detail-content">
                  <p className="detail-label">UV Index</p>
                  <p className="detail-value">{Math.round(weather.main.temp / 5)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!weather && !error && !loading && (
          <div className="empty-state">
            <p>🌍 Search for a city to get started!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeatherApp;
