import React, { useState, useEffect } from "react";
import "./App.css";


import {
  MenuItem,
  FormControl,
  Select,

} from "@material-ui/core";

import { sortData, prettyPrintStat } from "./util";
import Map from "./Map";

import "leaflet/dist/leaflet.css";

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          let sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };

    getCountriesData();
  }, []);

  console.log(casesType);

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID DATATHON</h1>
          
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">

          <figure class="snip1585">
            <img src="images/Two-small.jpeg"  />
            <figcaption>
              <h3>First<span>Graph</span></h3>
            </figcaption>
            <a href="images/Two.jpeg" target="_blank"></a>
          </figure>

          <figure class="snip1585">
          <img src="images/Two-small.jpeg"  />
          <figcaption>
          <h3>Second<span>Graph</span></h3>
          </figcaption>
          <a href="images/Two.jpeg" target="_blank"></a>
        </figure>

          <figure class="snip1585"><img src="images/Two-small.jpeg"  />
            <figcaption>
            <h3>Third<span>Graph</span></h3>
            </figcaption>
            <a href="images/Two.jpeg" target="_blank"></a>
          </figure>

          
          <figure class="snip1585"><img src="images/j3.png"  />
            <figcaption>
            <h3>Analysis<span>Notebook</span></h3>
            </figcaption>
            <a href="images/Two.jpeg" target="_blank"></a>
          </figure>
        
        </div>

        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>

    </div>
  );
};

export default App;