import React, { useState, useEffect } from "react";
import axios from "axios";
import './WeatherComponent.css';

const WeatherComponent = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("https://canwrobel.de/1880/weather")
      .then((response) => {
        setWeatherData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  // Hilfsfunktionen zur Formatierung von Datum und Uhrzeit
  const formatDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString();
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Vorhersagen nach Tagen gruppieren
  const dailyForecasts = weatherData ? weatherData.list.reduce((acc, forecast) => {
    const date = formatDate(forecast.dt);
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(forecast);
    return acc;
  }, {}) : {};

  // Funktion, um die aktuellste Vorhersage für heute zu finden
  const getCurrentForecast = () => {
    if (!weatherData) return null;
    const now = Date.now() / 1000;
    return weatherData.list.find((forecast) => forecast.dt > now) || weatherData.list[0];
  };

  // Funktion, um die Vorhersage für 16:00 Uhr zu finden
  const getForecastFor16 = (forecasts) => {
    return (
      forecasts.find((f) => new Date(f.dt * 1000).getHours() === 16) ||
      forecasts[5]
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!weatherData) return <div>No weather data available</div>;

  return (
    <div className="weather-container">
      {Object.keys(dailyForecasts).map((date, index) => {
        const forecasts = dailyForecasts[date];

        if (!forecasts || forecasts.length === 0) return null;

        const isToday = index === 0;
        const currentForecast = isToday
          ? getCurrentForecast()
          : getForecastFor16(forecasts);

        if (!currentForecast) return null;

        return (
          <div key={date} className="rw-container css-1qhov81">
            <div className="rw-container-main">
              <div className="rw-container-left">
              <h2 className="rw-container-header">
                  Berlin {isToday ? " Heute" : ` ${new Date(currentForecast.dt * 1000).toLocaleDateString(undefined, { weekday: 'long' })}`}
                </h2>
                <div className="rw-today css-w3t7ie">
                  <div className="rw-today-date">
                    {date} - {formatTime(currentForecast.dt)}
                  </div>
                  <div className="rw-today-hr"></div>
                  <div className="rw-today-current">
                    {currentForecast.main.temp.toFixed(0)} °C
                  </div>
                  <div className="rw-today-range">
                    {currentForecast.main.temp_max.toFixed(0)} /{" "}
                    {currentForecast.main.temp_min.toFixed(0)} °C
                  </div>
                  <div className="rw-today-desc">
                    {currentForecast.weather[0].description}
                  </div>
                  <div className="rw-today-hr"></div>
                  <div className="rw-today-info">
                    <div>
                      Wind:{" "}
                      <b>{(currentForecast.wind.speed * 3.6).toFixed(1)}</b>{" "}
                      Km/h
                    </div>
                    <div>
                      Humidity: <b>{currentForecast.main.humidity}</b> %
                    </div>
                  </div>
                </div>
              </div>
              <div className="rw-container-right">
                <img
                  src={`http://openweathermap.org/img/wn/${currentForecast.weather[0].icon}@2x.png`}
                  alt={currentForecast.weather[0].description}
                  width="120"
                  height="120"
                />
              </div>
            </div>

            <div className="rw-forecast-days-panel css-evb4g3">
              {forecasts.slice(0, 8).map((item) => (
                <div key={item.dt} className="rw-forecast-day">
                  <div className="rw-forecast-date">{formatTime(item.dt)}</div>
                  <div className="rw-forecast-icon">
                    <img
                      src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                      alt={item.weather[0].description}
                      width="120"
                      height="120"
                    />
                  </div>
                  <div className="rw-forecast-desc">
                    {item.weather[0].description}{" "}
                    {item.rain && item.rain["3h"]
                      ? `${item.rain["3h"]} mm/h`
                      : ""}
                  </div>
                  <div
                    className="rw-forecast-range"
                    style={{
                      border:
                        item.wind.speed * 3.6 < 10
                          ? "3px solid green"
                          : item.wind.speed * 3.6 < 15
                          ? "3px solid yellow"
                          : "none",
                      fontWeight:
                        item.wind.speed * 3.6 < 15 ? "bold" : "normal",
                      padding: "5px",
                    }}
                  >
                    {item.main.temp.toFixed(0)} °C{" "}
                    <img
                      src="https://media.istockphoto.com/id/1368763816/de/vektor/windblasvektor-symbol-luft-puff-symbol.jpg?s=612x612&w=0&k=20&c=2m6CAD1_6bQGUbT6z4TNVdxRTEu-sWaE4BUwpwk3-PQ="
                      className="icon"
                      style={{
                        width: "20px",
                        height: "20px",
                        verticalAlign: "middle",
                        marginRight: "5px",
                      }}
                    />
                    {(item.wind.speed * 3.6).toFixed(1)} km/h
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default WeatherComponent;