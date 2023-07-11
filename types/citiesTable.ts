import { Dispatch, SetStateAction } from 'react';
import { WeatherData } from "./common";
import { Data } from '../interfaces/citiesTable';

export type CitiesTableProps = {
    weatherData: WeatherData[];
    selectedCity: string;
    setSelectedCity: Dispatch<SetStateAction<string>>;
};

export type Filter = {
    isTriggered: boolean;
    filterFunc: (data: Data[]) => Data[];
};

export type Order = 'asc' | 'desc';