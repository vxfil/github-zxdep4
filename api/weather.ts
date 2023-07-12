import { get } from './config';

type WeatherParams = {
    latitude: number;
    longitude: number;
    daily: string;
    current_weather: boolean;
    timezone: string;
};

export const Weather = {
    getTemperatureAndWind: (params: WeatherParams) => get(`/v1/forecast`, { params }),
}