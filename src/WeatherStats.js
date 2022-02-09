/*

Fetch and display weather statistics

*/

import { useEffect, useState } from 'react';

function WeatherStats() {
  const [data, setData] = useState({
    date: "",
    temperature: null,
    windSpeed: null,
    windDirection: "",
    cloudiness: "",
    city: ""
  });

  useEffect(() => {
    // Change the date format to finnish standard
    const formatDate = (date) => {
      let day = date.split("T")[0].split("-");
      let time = date.split("T")[1].split(":");
      return `${Number(day[2])}.${Number(day[1])}.${day[0]} ${time[0]}:${time[1]}`;
    }

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
            date: formatDate(results[0].firstElementChild.lastElementChild.firstElementChild.firstElementChild.textContent),
            city: city
            });
        })
        .catch((err) => console.error(err));
    }

    // Get the city based on user coordinates from locationIQ API
    const getCity = async (location) => {
    fetch(`https://eu1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&lat=${location.coords.latitude}&lon=${location.coords.longitude}&format=json`)
      .then((res) => res.text())
      .then((res) => fetchWeatherData(JSON.parse(res).address.city))
    }

    // If users location is not available, fetch weather from Helsinki by default
    const fetchDefault = async () => {
      fetchWeatherData("Helsinki");
    }

    // Get users location
    navigator.geolocation.getCurrentPosition(getCity, fetchDefault);
  }, []);

  return (
    <div className='weatherStats'>
      <h1>{data.city}</h1>
      <p>{data.date}</p>
      <h1>{data.temperature} °C</h1>
    </div>
  );
}

export default WeatherStats;
