/*

Fetch and display weather statistics

*/

import React from 'react';

function WeatherStats() {
  const [data, setData] = React.useState({
    date: "",
    temperature: 0,
    windSpeed: 0,
    windDirection: "",
    cloudiness: "",
  });

  React.useEffect(() => {
    // Get weather information from Ilmatieteenlaitos API
    const fetchWeatherData = async (city) => {
      fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&storedquery_id=fmi::observations::weather::timevaluepair&place=${city}&`)
        .then((res) => res.text())
        .then((res) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(res, "text/html");
          const results = xml.getElementsByTagName("om:result");
          console.log(results[0]);
          console.log(results[0].firstElementChild.lastElementChild.firstElementChild.lastElementChild.textContent);
          setData({
            temperature: Math.round(Number(results[0].firstElementChild.lastElementChild.firstElementChild.lastElementChild.textContent)),
            date: results[0].firstElementChild.lastElementChild.firstElementChild.firstElementChild.textContent,
            });
        })
        .catch((err) => console.error(err));
    }

    // Get the city based on user coordinates from locationIQ API
    const getCity = async (location) => {
    fetch(`https://eu1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&lat=${location.coords.latitude}&lon=${location.coords.longitude}&format=json`)
      .then((res) => res.text())
      .then((res) => fetchWeatherData(JSON.parse(res).address.city.toLowerCase()));
    }

    // Get users location
    navigator.geolocation.getCurrentPosition(getCity);
  }, []);

  return (
    <div className='weatherStats'>
      <h1>Lämpötila</h1>
      <p>{data.temperature} °C</p>
      <h1>PVM</h1>
      <p>{data.date}</p>
    </div>
  );
}

export default WeatherStats;
