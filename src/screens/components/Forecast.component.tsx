import { useWeather } from "../../context/weatherContext";

function ForecastComponent() {
  const { forecast } = useWeather();

  if (!forecast) {
    return <div>Loading...</div>;
  }

  const { forecastday } = forecast.forecast;

  const getIcon = (image: string) => {
    return (
      <img
        src={image}
        alt="weather condition"
        className="w-10 aspect-square "
      />
    );
  };
  const isToday = (dateEpoch: number) => {
    const forecastDate = new Date(dateEpoch * 1000);
    const today = new Date();
    return (
      forecastDate.getDate() === today.getDate() &&
      forecastDate.getMonth() === today.getMonth() &&
      forecastDate.getFullYear() === today.getFullYear()
    );
  };
  return (
    <div className="bg-slate-50 dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full lg:mx-auto">
      <h1 className="text-lg font-bold  text-black dark:text-slate-400 mb-4">Forecast</h1>
      <div className="space-y-4">
        {forecastday.map((day) => (
          <div
            key={day.date_epoch}
            className="flex justify-between items-center space-x-4 p-4 bg-slate-50 dark:bg-gray-900 rounded-md shadow-md"
          >
            <h4 className="text-black dark:text-white flex-1 font-bold">
              {isToday(day.date_epoch)
                ? "Today"
                : new Date(day.date_epoch * 1000).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
            </h4>
            <div className="flex gap-4  text-black dark:text-white   justify-end items-center">
              {new Date(day.date).toLocaleDateString()}
            </div>
            <div className="flex gap-4 flex-1 justify-end items-center">
              <span>{getIcon(day.day.condition.icon)}</span>
              <span className="font-bold text-black dark:text-white text-right">
                {day.day.maxtemp_c}°
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ForecastComponent;
