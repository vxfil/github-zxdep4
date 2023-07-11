import { WeatherData } from "./common";

export type ChartProps = {
    weatherData: WeatherData[];
    selectedCity: string;
};

export type LastSevenDaysData = {
    date: string;
    dayName: string;
    averageDayTemp: number;
};

export type DailyWeather = {
    dayName: string;
    date: string;
    averageWeekTemp: number;
};