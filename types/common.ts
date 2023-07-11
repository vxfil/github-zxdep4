export type WeatherData = {
    latitude: number;
    longitude: number;
    generationtime_ms: number;
    utc_offset_seconds: number;
    timezone: string;
    timezone_abbreviation: string;
    elevation: number;
    current_weather: {
        temperature: number;
        windspeed: number;
        winddirection: number;
        weathercode: number;
        is_day: number;
        time: string;
    };
    daily_units: {
        time: string;
        temperature_2m_max: string;
        temperature_2m_min: string;
        winddirection_10m_dominant: string;
    };
    daily: {
        time: string[];
        temperature_2m_max: number[];
        temperature_2m_min: number[];
        winddirection_10m_dominant: number[];
    };
    country: string;
    city: string;
};