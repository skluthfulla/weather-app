 
import { useWeather } from "../../context/weatherContext";

function WeatherComponent() {
  const { weather } = useWeather();

  return (
    <div className="p-6  flex justify-between items-center">
      <div className="flex flex-col justify-between space-y-16">
        <div className=" flex flex-col gap-2">
          <h1 className="font-bold text-3xl text-black dark:text-white  tracking-wide">
            {weather?.location.name}- {weather?.location.country}
          </h1>
          <p className="text-lg text-black dark:text-gray-400">
            Humidity:{" "}
            <span className="font-semibold">{weather?.current.humidity}</span>
          </p>
        </div>

        <h1 className="font-extrabold text-6xl text-black dark:text-white">
          {weather?.current.temp_c}°
        </h1>
      </div>

      <div>{<img src={weather?.current.condition.icon} alt="weather condition" className="w-32 aspect-square " />}</div>
    </div>
  );
}

export default WeatherComponent;
