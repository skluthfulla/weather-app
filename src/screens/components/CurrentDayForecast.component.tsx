import { useWeather } from "../../context/weatherContext";

export default function CurrentDayForecastComponent() {
  const { forecast } = useWeather();

  if (!forecast) {
    return <div>Loading...</div>;
  }

  const currentDayForecast = forecast.forecast.forecastday[0];

  const getIcon = (image: string) => {
    return <img src={image} className="w-16 h-16" alt="weather-icon" />;
  };

  return (
    <div className=" ml-2 lg:mx-auto bg-slate-50 dark:bg-gray-800 p-6 rounded-lg w-full max-w-screen-lg ">
      <h1 className="text-lg font-bold text-black dark:text-slate-400 mb-4">
        Today's Forecast
      </h1>
      <div className="flex w-full overflow-x-auto space-x-4">
        {currentDayForecast.hour.map((hour, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-2 p-8  border-r"
          >
            <span className="text-lg text-nowrap text-black dark:text-gray-300 ">
              {new Date(hour.time_epoch ?? 0 * 1000).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            <span className="lg:text-5xl md:text-2xl text-xl font-bold text-black dark:text-gray-300 ">
              {Math.round(hour.temp_c)}°C
            </span>
            {getIcon(hour.condition.icon)}
          </div>
        ))}
      </div>
    </div>
  );
}
