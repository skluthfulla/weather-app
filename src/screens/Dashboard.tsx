import { useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ForecastComponent from "./components/Forecast.component";
import WeatherComponent from "./components/Weather.component";
import AirConditionsComponent from "./components/AirConditions.component";
import CurrentDayForecastComponent from "./components/CurrentDayForecast.component";
import { useWeather } from "../context/weatherContext";

function Dashboard() {
  const { error, loading, fetchWeatherByLocation } = useWeather();
  useEffect(() => {
    fetchWeatherByLocation("Hyderabad");
  }, []);
  return (
    <div className="w-full min-h-screen flex flex-col gap-4 ">
      <div className="container  mx-auto w-full sticky top-4   z-10 grid grid-cols-1 lg:grid-cols-3 gap-6  ">
        <div className="lg:col-span-2  backdrop-blur-sm bg-slate-600/10 rounded-md">
          <SearchBar />
        </div>
      </div>

      {loading && (
        <div className="container mx-auto   flex items-center justify-center w-full max-w-screen-xl flex-1">
          <h1 className="text-3xl text-black dark:text-white">Loading ....</h1>
        </div>
      )}
      {error && (
        <div className="container mx-auto  flex items-center justify-center w-full max-w-screen-xl flex-1">
          <h1 className="text-3xl text-black dark:text-white">{error}</h1>
        </div>
      )}
      {!loading && !error && (
        <div className="container mx-auto grid grid-cols-1 mb-5 lg:grid-cols-3 gap-6 w-full   flex-1">
          <div className="lg:col-span-2 space-y-6 w-full  overflow-y-auto h-full ">
            <WeatherComponent />
            <CurrentDayForecastComponent />
            <AirConditionsComponent />
          </div>
          <div>
            <ForecastComponent />
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
