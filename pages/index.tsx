import React, { useEffect, useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import Container from '@mui/material/Container';
import { CitiesTable, Chart } from '../components';
import { CITIES } from '../constants';
import { Weather } from '../api/weather';
import { WeatherData } from '../common';

export default function Home() {
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const getDataFromPromisesArr = async (promises: Promise<AxiosResponse>[]) => {
    try {
      setLoading(true);
      const data = await axios.all(promises);
      setLoading(false);
      return data.map((response) => {
        const { config: { params }, data } = response;

        return { ...data, country: params.country, city: params.city };
      });
    } catch (error) {
      setLoading(false);
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
        flexWrap: 'wrap-reverse',
      }}
    >
      <Chart
        weatherData={weatherData}
        selectedCity={selectedCity}
        loading={loading}
      />
      <CitiesTable
        loading={loading}
        weatherData={weatherData}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
      />
    </Container>
  );
}
