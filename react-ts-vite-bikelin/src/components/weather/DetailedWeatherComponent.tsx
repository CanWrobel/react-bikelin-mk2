import React, { useState, useEffect } from "react";
import axios from "axios";

const DetailedWeatherComponent = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lat = 52.52;
  const lon = 13.405;
  const dt = Math.floor(Date.now() / 1000); 
  const apiKey = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

  useEffect(() => {
    const fetchTimeMachineData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${dt}&appid=${apiKey}&units=metric`
        );
        console.log('Weather Data:', response.data);  
        setWeatherData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        setIsLoading(false);
      }
    };

    fetchTimeMachineData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!weatherData?.data?.[0]) return null;

  const forecast = weatherData.data[0];

  return (
    <div className="rw-container css-1qhov81">
      <div className="rw-container-main">
        <div className="rw-container-left">
          <div className="rw-today css-w3t7ie">
            <div className="rw-today-date">
              {new Date(dt * 1000).toLocaleDateString()} - 
              {new Date(dt * 1000).toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </div>
            <div className="rw-today-hr"></div>
            <div className="rw-today-current">
              {forecast.temp.toFixed(0)} °C
            </div>
            <div className="rw-today-desc">
              {forecast.weather[0].description}
            </div>
            <div className="rw-today-info">
              <div>
                Wind: <b>{(forecast.wind_speed * 3.6).toFixed(1)}</b> km/h
              </div>
              <div>
                Humidity: <b>{forecast.humidity}</b> %
              </div>
              {forecast.rain && (
                <div>
                  Rain: <b>{forecast.rain["1h"]}</b> mm/h
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="rw-container-right">
          <img
            src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png`}
            alt={forecast.weather[0].description}
            width="120"
            height="120"
          />
        </div>
      </div>
    </div>
  );
};

export default DetailedWeatherComponent;