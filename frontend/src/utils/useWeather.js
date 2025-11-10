import { useEffect, useState } from "react";
import axios from "axios";

export default function useWeather() {
  const [weather, setWeather] = useState(null);
  const [isDay, setIsDay] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const { data } = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=Kolkata&appid=${
            import.meta.env.VITE_WEATHER_API
          }&units=metric`
        );
        setWeather(data.weather[0].main);
        const hour = new Date().toLocaleString("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          hour12: false,
        });
        setIsDay(hour >= 6 && hour < 18);
      } catch (err) {
        console.error("Weather fetch failed", err);
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 1800000);
    return () => clearInterval(interval);
  }, []);

  return { weather, isDay };
}
