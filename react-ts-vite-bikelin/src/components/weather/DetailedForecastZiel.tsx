import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRoute } from '../../contexts/RouteContext';

const DetailedForecastZiel = () => {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { 
    routeInfo, 
    setArrivalTime, 
    setArrivalTimeUnix
  } = useRoute();

  
  const apiKey = '0ebbf6dcf9f845bc366dec03a56a0ece';  

  useEffect(() => {
    const fetchTimeMachineData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${routeInfo.endLocation?.lat}&lon=${routeInfo.endLocation?.lng}&dt=${routeInfo.arrivalTimeUnix}&appid=${apiKey}&units=metric`
        );
        
        console.log('Weather Data:', response.data);  
        setWeatherData(response.data);
        setIsLoading(false);
      } catch (err) {
        console.error('Error details:', err);  // Log any errors
        setError(err instanceof Error ? err.message : 'Failed to fetch weather');
        setIsLoading(false);
      }
    };

    fetchTimeMachineData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!weatherData?.data?.[0]) return null;

  const forecastStart = weatherData.data[0];

  return (
    <div className="rw-container css-1qhov81">
      <div className="rw-container-main">
        <div className="rw-container-left">
        <div className="rw-today css-w3t7ie">
        </div>

        <h2 className="rw-container-header">
                 Ziel: {routeInfo.endAddress}
                </h2>
          <div className="rw-today css-w3t7ie">
            <div className="rw-today-date">
              {routeInfo.arrivalTime}
            </div>
            <div className="rw-today-hr"></div>
            <div className="rw-today-current">
              {forecastStart.temp.toFixed(0)} °C
            </div>
            <div className="rw-today-desc">
              {forecastStart.weather[0].description}
            </div>
            <div className="rw-today-info">
              <div>
                Wind: <b>{(forecastStart.wind_speed * 3.6).toFixed(1)}</b> km/h
              </div>
              <div>
                Humidity: <b>{forecastStart.humidity}</b> %
              </div>
              {forecastStart.rain && (
                <div>
                  Rain: <b>{forecastStart.rain["1h"]}</b> mm/h
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="rw-container-right">
          <img
            src={`http://openweathermap.org/img/wn/${forecastStart.weather[0].icon}@2x.png`}
            alt={forecastStart.weather[0].description}
            width="120"
            height="120"
          />
        </div>
      </div>
    </div>
  );
};

export default DetailedForecastZiel;