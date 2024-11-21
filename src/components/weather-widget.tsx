"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { Thermometer , Cloud , MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
type IWeatherData = {
  temperature: number;
  description: string;
  location: string;
  unit: string;
};

export default function WeatherWidget() {
  const [location, setLocation] = useState<string>("");
  const [weather, setWeather] = useState<IWeatherData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, SetIsLoading] = useState<boolean>(false);

  const handleSearch = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedLocation = location.trim();
    if (trimmedLocation === "") {
      setError("Please enter a valid location.");
      setWeather(null);
      return;
    }
    SetIsLoading(true);
    setError(null);

    // try {
    //   const response = await fetch(
    //     `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
    //   );
    try {
      // Fetch weather data from the weather API
      const response = await fetch(
        `https://api.weatherapi.com/v1/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${trimmedLocation}`
      );

      if (!response.ok) {
        throw new Error("City not found.");
      }
      const data = await response.json();
      const weatherData:IWeatherData = {
        temperature: data.current.temp_c,
        description: data.current.condition.text,
        location: data.location.name,
        unit: "C",
      };
      setWeather(weatherData);
    } catch (error) {
      console.error("Error fetching weather data.", error);
      setError("City not found. Please try again.");
    } finally {
      SetIsLoading(false);
    }
  };
  function getTemperatureMessage(temperature: number, unit: string) :string {
    if (unit === "C") {
      if (temperature < 0) {
        return `It's Freezing at ${temperature}°C. Bundle up!`;
      } else if (temperature < 10) {
        return `It's quite cold at ${temperature}°C. Wear warm clothes.`;
      } else if (temperature < 20) {
        return `The temperature is ${temperature}°C. Comfortable for a light jacket.`;
      } else if (temperature < 30) {
        return `It's a pleasant ${temperature}°C. Enjoy the nice weather!`;
      } else {
        return `It's hot at ${temperature}°C. Stay hydrated!`;
      }
    } else {
      return `${temperature} ${unit}`;
    }
  }

  function getWeatherMessage(description: string): string {
    switch (description.toLowerCase()) {
      case "sunny":
        return "It's a beautiful sunny day!";
      case "partly cloudy":
        return "Expect some clouds and sunshine.";
      case "cloudy":
        return "It's cloudy today.";
      case "overcast":
        return "The sky is overcast.";
      case "rain":
        return "Don't forget your umbrella! It's raining.";
      case "thunderstorm":
        return "Thunderstorms are expected today.";
      case "snow":
        return "Bundle up! It's snowing.";
      case "mist":
        return "It's misty outside.";
      case "fog":
        return "Be careful, there's fog outside.";
      default:
        return "Weather description not available.";
      // return description
    }
  }

  function getLocationMessage(Location: string): string {
    const currentHour = new Date().getHours();
    const isNight = currentHour >= 18 || currentHour < 6;
    return `${location} ${isNight? "at night" : "during the day"}`;
  }

  return (
    <main className="flex justify-center items-center h-screen max-h-md ">
        {/* header of the card */}
        <Card>
            <CardHeader className="text-center">
                <CardTitle>Weather Widget</CardTitle>
            <CardDescription>
            Search for the current weather conditions in your city.
            </CardDescription>
          </CardHeader>
        {/* content in the card */}
        <CardContent>
            {/* form for input and submit location */}
            <form onSubmit={handleSearch} className="flex justify-between gap-2">
            <Input
            type="text"
                placeholder="Enter the city name"
                value={location}
                className="rounded-2xl"
                onChange={
                    (e:ChangeEvent<HTMLInputElement>) =>{
                        setLocation(e.target.value)
                    }
                }
                />
                <Button
                type="submit"
                className="rounded-2xl"
                disabled={isLoading}
                >
                    {isLoading? "Loading..." : "Search"}{""}
                </Button>
            </form>
            {/* error msg if any */}
            {error && <div className="mt-5 text-red-500">{error}</div>}
            {/* weather data if available */}
            {weather && 
            <div className="mt-4 gap-2 grid">
                {/* temperature msg with icon */}
                <div className="flex gap-2">
                    <Thermometer className="w-4 h-4"/>
                    {getTemperatureMessage(weather.temperature , weather.unit)}
                </div>
                {/* weather msg with icon */}
                <div className="flex gap-2">
                    <Cloud className="h-4 w-4"/>       
                     {getWeatherMessage(weather.description)}
                </div>
                {/* location msg with icon */}
                <div className="flex gap-2">
                    <MapPin className="w-4 h-4" />
                    {getLocationMessage(weather.location)}
                </div>
            </div>
                }
                </CardContent>
        </Card>
    </main>
  );
}
