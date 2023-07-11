import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Container from '@mui/material/Container';
import { CitiesTable, Chart } from '../components';
import { CITIES } from '../constants/cities';
import { Weather } from '../api/weather';
import { WeatherData } from '../types/common';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');

  const getDataFromPromisesArr = async (promises: Promise<AxiosResponse>[]) => {
    try {
      const data = await axios.all(promises);
      return data.map((response) => {
        const { config: { params }, data } = response;

        return { ...data, country: params.country, city: params.city };
      });
    } catch (error) {
      console.log("___________error", error);
      return [];
    }
  };

  useEffect(() => {
    const promises = CITIES.map((params) => Weather.getTemperatureAndWind(params));

    const fetchData = async () => {
      const res = await getDataFromPromisesArr(promises);
      setWeatherData(res);
    };

    fetchData();
  }, []);

  return (
    <Container
      maxWidth="xl"
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Chart
        weatherData={weatherData}
        selectedCity={selectedCity}
      />
      <CitiesTable
        weatherData={weatherData}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />
    </Container>
  );
}
