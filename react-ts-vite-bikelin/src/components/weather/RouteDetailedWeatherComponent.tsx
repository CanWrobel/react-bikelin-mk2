import React, { useState, useEffect } from "react";
import axios from "axios";

interface LocationWeather {
  weatherData: any;
  timestamp: number;
  location: string;
}


const RouteDetailedWeatherComponent = ({ 
  startLat, 
  startLon, 
  endLat, 
  endLon,
  duration  // duration in seconds
}) => {
  const [startWeather, setStartWeather] = useState<LocationWeather | null>(null);
  const [endWeather, setEndWeather] = useState<LocationWeather | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const apiKey = '0ebbf6dcf9f845bc366dec03a56a0ece';

  useEffect(() => {
    const fetchBothLocations = async () => {
      try {
        setIsLoading(true);
        const startTime = Math.floor(Date.now() / 1000);
        const endTime = startTime + (duration || 0);

        // Fetch start location weather
        const startResponse = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${startLat}&lon=${startLon}&dt=${startTime}&appid=${apiKey}&units=metric`
        );

        // Fetch end location weather
        const endResponse = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${endLat}&lon=${endLon}&dt=${endTime}&appid=${apiKey}&units=metric`
        );

        setStartWeather({
          weatherData: startResponse.data,
          timestamp: startTime,
          location: "Start"
        });

        setEndWeather({
          weatherData: endResponse.data,
          timestamp: endTime,
          location: "Destination"
        });

        setIsLoading(false);
      } catch (err) {
        console.error('Error details:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        setIsLoading(false);
      }
    };

    if (startLat && startLon && endLat && endLon) {
      fetchBothLocations();
    }
  }, [startLat, startLon, endLat, endLon, duration]);

  const WeatherDisplay = ({ weather }: { weather: LocationWeather }) => {
    if (!weather?.weatherData?.data?.[0]) return null;
    const forecast = weather.weatherData.data[0];

    return (
      <div className="rw-container css-1qhov81">
        <div className="rw-container-main">
          <div className="rw-container-left">
            <h3 style={{ margin: '0 0 10px 0' }}>{weather.location}</h3>
            <div className="rw-today css-w3t7ie">
              <div className="rw-today-date">
                {new Date(weather.timestamp * 1000).toLocaleDateString()} - 
                {new Date(weather.timestamp * 1000).toLocaleTimeString([], { 
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
      {startWeather && <WeatherDisplay weather={startWeather} />}
      {endWeather && <WeatherDisplay weather={endWeather} />}
    </div>
  );
};

export default RouteDetailedWeatherComponent;