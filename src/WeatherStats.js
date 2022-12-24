/*

Fetch and display weather statistics

*/

import { IconButton, Snackbar, SnackbarContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';

function WeatherStats(props) {
  const [data, setData] = useState({
    date: "",
    temperature: null,
    windSpeed: null,
    windDirection: "",
    cloudiness: "",
    city: ""
  });
  const [ snackbarOpen, setSnackbarOpen ] = useState(false);

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  useEffect(() => {
    // Get weather information from Ilmatieteenlaitos API
    const fetchWeatherData = (city) => {
      // if (city === null) return;
      let endtime = new Date(new Date());
      endtime = endtime.toISOString();
      console.log(endtime)
      let temp = endtime.split("");
      temp.splice(endtime.length - 5, 4);
      endtime = temp.join("");
      console.log(endtime)

      let starttime = new Date(new Date() - 60 * 60000);
      starttime = starttime.toISOString();
      console.log(starttime)
      temp = starttime.split("");
      temp.splice(starttime.length - 5, 4);
      starttime = temp.join("");
      console.log(starttime)
      fetch(`https://opendata.fmi.fi/wfs/fin?service=WFS&version=2.0.0&request=GetFeature&storedquery_id=fmi::observations::weather::timevaluepair&place=${city}&starttime=${starttime}&endtime=${endtime}`)
        .then((res) => res.text())
        .then((res) => {
          const parser = new DOMParser();
          const xml = parser.parseFromString(res, "text/html");
          console.log(xml)
          const results = xml.getElementsByTagName("om:result");
          console.log(results)
          console.log(results[0].firstElementChild.lastElementChild.firstElementChild.lastElementChild.textContent)
          setData({
            temperature: Math.round(Number(results[0].firstElementChild.lastElementChild.firstElementChild.lastElementChild.textContent)),
            date: formatDate(results[0].firstElementChild.lastElementChild.firstElementChild.firstElementChild.textContent),
            city: city
            });
        })
        .catch((err) => {
          console.error(err);
          // Give an error message for users if there was an error fetching weather data
          setSnackbarOpen(true);
        });
    }

    // Change the date format to finnish standard
    const formatDate = (date) => {
      let day = date.split("T")[0].split("-");
      let time = date.split("T")[1].split(":");
      return `${Number(day[2])}.${Number(day[1])}.${day[0]} ${time[0]}:${time[1]}`;
    }
    fetchWeatherData(props.city);
  }, [props.city]);

  return (
    <div>
      <div className='weatherStats'>
        <h1>{data.city}</h1>
        <p>{data.date}</p>
        <h1>{data.temperature} °C</h1>
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <SnackbarContent
          style={{backgroundColor: "#ed7a72", color: "black"}}
          message={`Error getting weather data from ${props.city}!`}
          action={
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        />
      </Snackbar>
    </div>
  );
}

export default WeatherStats;
