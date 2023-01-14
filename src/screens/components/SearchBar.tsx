import  { useEffect, useState } from "react";
import { FaHistory, FaLocationArrow } from "react-icons/fa";
import { useWeather } from "../../context/weatherContext";
import { FaX } from "react-icons/fa6";

function SearchBar() {
  const {
    loading,
    fetchWeatherByCoords,
    fetchWeatherByLocation,
  } = useWeather();
  const [locationName, setLocationName] = useState("");
  const [isLocationFetching, setIsLocationFetching] = useState(false);

  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    const storedHistory = JSON.parse(
      localStorage.getItem("searchHistory") || "[]"
    );
    setSearchHistory(storedHistory);
  }, []);
  function showError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      default:
        alert("An unknown error occurred.");
        break;
    }
  }

  const handleLocationFetch = () => {
    try {
      setIsLocationFetching(true);

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            console.log(position.coords.latitude, position.coords.longitude);
            fetchWeatherByCoords(
              position.coords.latitude,
              position.coords.longitude
            );
          },
          showError,
          { timeout: 10000 }
        );
      } else {
        alert("Location fetch not suppported in this browser");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsLocationFetching(false);
    }
  };

  const handleSearch = () => {
    fetchWeatherByLocation(locationName);
    saveToHistory(locationName.trim());
  };

  const saveToHistory = (location: string) => {
    const lowercasedLocation = location.toLowerCase();
    const updatedHistory = searchHistory.filter(
      (loc) => loc.toLowerCase() !== lowercasedLocation
    );
    updatedHistory.unshift(location);
    localStorage.setItem(
      "searchHistory",
      JSON.stringify(updatedHistory.slice(0, 10))
    );
    setSearchHistory(updatedHistory.slice(0, 10));
  };
  const removeFromHistory = (index: number) => {
    const updatedHistory = searchHistory.filter((_, idx) => idx !== index);

    localStorage.setItem(
      "searchHistory",
      JSON.stringify(updatedHistory.slice(0, 10))
    );
    setSearchHistory(updatedHistory.slice(0, 10));
  };

  const handleHistoryClick = (location: string) => {
    setLocationName(location);
    fetchWeatherByLocation(location);
    setIsHistoryVisible(false);
  };
  return (
    <div className="relative ">
      <div className=" w-full flex dark:bg-gray-700 border overflow-hidden text-white rounded-lg">
        <input
          type="text"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          placeholder="Search for cities"
          onFocus={() => setIsHistoryVisible(true)}
          onBlur={() => setTimeout(() => setIsHistoryVisible(false), 200)} // Timeout for clicking history item
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
          className="w-full p-4 bg-transparent focus:outline-none"
        />
        <button
          disabled={loading}
          onClick={handleLocationFetch}
          className=" flex gap-2 items-center  text-nowrap px-4 bg-gray-900"
        >
          {loading || isLocationFetching ? (
            <span>fetching...</span>
          ) : (
            <>
              <FaLocationArrow />
              Locate Me
            </>
          )}
        </button>
      </div>
      {isHistoryVisible && searchHistory.length > 0 && (
        <div className="absolute mt-2 w-full p-2 rounded-md bg-slate-600">
          <div className="text-slate-200 flex justify-between items-center">
            <span>Previous Search History</span>
            <FaHistory />
          </div>
          <hr className="mt-1" />
          <ul className="mt-2">
            {searchHistory.map((location, index) => (
              <li
                key={index}
                className="cursor-pointer flex justify-between items-center hover:bg-slate-700 p-2 rounded-md"
              >
                <span
                  className="text-white w-full"
                  onClick={() => handleHistoryClick(location)}
                >
                  {location}
                </span>
                <FaX
                  className="dark:text-black bg-red-400/10 p-2 rounded-full"
                  onClick={() => removeFromHistory(index)}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default SearchBar;
