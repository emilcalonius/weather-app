/*

Main js file.
Get users location to show relevant weather statistics.

*/

import React, { useLayoutEffect, useState } from 'react';
import './App.css';
import Navigation from './Navigation';
import WeatherStats from './WeatherStats';

function App() {
  const [city, setCity] = useState("Helsinki");

  const updateCity = (newCity) => {
    setCity(newCity);
  };

  useLayoutEffect(() => {
    // Get the city based on user coordinates from locationIQ API
    const getCity = async (location) => {
      fetch(`https://eu1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&lat=${location.coords.latitude}&lon=${location.coords.longitude}&format=json`)
        .then((res) => res.text())
        .then((res) => setCity(JSON.parse(res).address.city))
    }

    // Get users location
    navigator.geolocation.getCurrentPosition(getCity);
  }, []);

  return (
    <div>
      <Navigation updateCity={updateCity} />
      <WeatherStats city={city} />
    </div>
  );
}

export default App;
