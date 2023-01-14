import React, { createContext, useState, useContext } from "react";
import axios, { AxiosError } from "axios";

interface WeatherCondition {
  text: string;
  icon: string;
  code: number;
}

interface WeatherCurrent {
  last_updated: string;
  temp_c: number;
  condition: WeatherCondition;
  wind_kph: number;
  humidity: number;
}

interface WeatherLocation {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
}

interface WeatherData {
  location: WeatherLocation;
  current: WeatherCurrent;
}

// Forecast interfaces
export interface IForecast {
  location: Location;
  current: Current;
  forecast: Forecast;
}

export interface Current {
  last_updated_epoch?: number;
  last_updated?: string;
  temp_c: number;
  temp_f: number;
  is_day: number;
  condition: Condition;
  wind_mph: number;
  wind_kph: number;
  wind_degree: number;
  wind_dir: WindDir;
  pressure_mb: number;
  pressure_in: number;
  precip_mm: number;
  precip_in: number;
  humidity: number;
  cloud: number;
  feelslike_c: number;
  feelslike_f: number;
  windchill_c: number;
  windchill_f: number;
  heatindex_c: number;
  heatindex_f: number;
  dewpoint_c: number;
  dewpoint_f: number;
  vis_km: number;
  vis_miles: number;
  uv: number;
  gust_mph: number;
  gust_kph: number;
  time_epoch?: number;
  time?: string;
  snow_cm?: number;
  will_it_rain?: number;
  chance_of_rain?: number;
  will_it_snow?: number;
  chance_of_snow?: number;
}

export interface Condition {
  text: string;
  icon: string;
  code: number;
}

export enum WindDir {
  W = "W",
  Wsw = "WSW",
}

export interface Forecast {
  forecastday: Forecastday[];
}

export interface Forecastday {
  date: string;
  date_epoch: number;
  day: Day;
  astro: Astro;
  hour: Current[];
}

export interface Astro {
  sunrise: string;
  sunset: string;
  moonrise: string;
  moonset: string;
  moon_phase: string;
  moon_illumination: number;
  is_moon_up: number;
  is_sun_up: number;
}

export interface Day {
  maxtemp_c: number;
  maxtemp_f: number;
  mintemp_c: number;
  mintemp_f: number;
  avgtemp_c: number;
  avgtemp_f: number;
  maxwind_mph: number;
  maxwind_kph: number;
  totalprecip_mm: number;
  totalprecip_in: number;
  totalsnow_cm: number;
  avgvis_km: number;
  avgvis_miles: number;
  avghumidity: number;
  daily_will_it_rain: number;
  daily_chance_of_rain: number;
  daily_will_it_snow: number;
  daily_chance_of_snow: number;
  condition: Condition;
  uv: number;
}

export interface Location {
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  tz_id: string;
  localtime_epoch: number;
  localtime: string;
}

export interface WeatherContextType {
  weather: WeatherData | null;
  forecast: IForecast | null;
  loading: boolean;
  error: string | null;
  fetchWeatherByLocation: (location: string) => void;
  fetchWeatherByCoords: (lat: number, lon: number) => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const WeatherProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<IForecast | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeatherByLocation = async (location: string) => {
    setLoading(true);
    setError(null);

    try {
      const response1 = await axios.get(
        `https://api.weatherapi.com/v1/current.json`,
        {
          params: {
            key: import.meta.env.VITE_WEATHER_API_KEY,
            q: location,
            aqi: "no",
          },
        }
      );

      const response2 = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json`,
        {
          params: {
            key: import.meta.env.VITE_WEATHER_API_KEY,
            q: location,
            days: 7,
            aqi: "no",
            alerts: "no",
          },
        }
      );

      setWeather(response1.data);
      console.log(response1.data);
      console.log(response2.data);
      setForecast(response2.data);
    } catch (error) {
      if (error instanceof AxiosError)
        setError(error.response?.data.error.message);
      else setError("Failed to fetch weather data.");
      console.error("Error fetching weather by location:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    setLoading(true);
    setError(null);

    try {
      const response1 = await axios.get(
        `https://api.weatherapi.com/v1/current.json`,
        {
          params: {
            key: import.meta.env.VITE_WEATHER_API_KEY,
            q: `${lat},${lon}`,
            aqi: "no",
          },
        }
      );

      const response2 = await axios.get(
        `https://api.weatherapi.com/v1/forecast.json`,
        {
          params: {
            key: import.meta.env.VITE_WEATHER_API_KEY,
            q: `${lat},${lon}`,
            days: 7,
            aqi: "no",
            alerts: "no",
          },
        }
      );

      setWeather(response1.data);
      setForecast(response2.data);
    } catch (error) {
      if (error instanceof AxiosError)
        setError(error.response?.data.error.message);
      else setError("Failed to fetch weather data.");
      console.error("Error fetching weather by coordinates:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WeatherContext.Provider
      value={{
        weather,
        forecast,
        loading,
        error,
        fetchWeatherByLocation,
        fetchWeatherByCoords,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

const useWeather = (): WeatherContextType => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("UseWeather must be used within a WeatherProvider");
  }
  return context;
};

export { WeatherProvider, useWeather };
