import React from 'react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { WeatherData } from '../../types/common';
import { ChartProps, LastSevenDaysData, DailyWeather } from '../../types/chart';

const Chart: React.FC<ChartProps> = (props) => {
    const { weatherData, selectedCity } = props;

    const reducedDataByCity = (weatherData: WeatherData[]): Record<string, LastSevenDaysData[]> => {
        return weatherData.reduce((acc: Record<string, LastSevenDaysData[]>, item) => {
            const { city, daily } = item;
            const { temperature_2m_min, temperature_2m_max, time } = daily;

            const lastSevenDaysData = time.map((date: string, index: number) => {
                const dayMinTemp = temperature_2m_min[index];
                const dayMaxTemp = temperature_2m_max[index];
                const averageDayTemp = (dayMinTemp + dayMaxTemp) / 2;
                const dayName = format(new Date(date), 'EE');
                return {
                    date,
                    dayName,
                    averageDayTemp,
                };
            });

            const res = { ...acc, [city]: lastSevenDaysData.slice(0, -1) };
            return res;
        }, {});
    };

    const reducedDataByDays = (weatherData: WeatherData[]): DailyWeather[] => {
        const days: { [dayName: string]: DailyWeather } = {};

        for (const item of weatherData) {
            const { daily } = item;
            const { temperature_2m_min, temperature_2m_max, time } = daily;

            for (let i = 0; i < time.length - 1; i++) {
                const date = time[i];
                const dayMinTemp = temperature_2m_min[i];
                const dayMaxTemp = temperature_2m_max[i];
                const averageDayTemp = (dayMinTemp + dayMaxTemp) / 2;
                const dayName = format(new Date(date), 'EE');

                if (days.hasOwnProperty(dayName)) {
                    days[dayName].averageWeekTemp += averageDayTemp;
                } else {
                    days[dayName] = { dayName, date, averageWeekTemp: averageDayTemp };
                }
            }
        }

        return Object.values(days).map((item) => ({
            ...item,
            averageWeekTemp: Number((item.averageWeekTemp / weatherData.length).toFixed(1)),
        }));
    };

    const defaultData = reducedDataByDays(weatherData);

    const isSelectedCity = selectedCity;

    const dataByCity = reducedDataByCity(weatherData)[selectedCity];
    const dataToRender = !isSelectedCity ? defaultData : dataByCity;

    return (
        <Box sx={{
            width: 453,
            height: 432,
            background: '#1A1A1A',
            borderRadius: '16px',
            paddingTop: '16px',
        }}>
            <Box sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 24px',
            }}>
                <Typography variant="h5" sx={{
                    fontSize: '16px',
                    color: '#FDFCFF',
                    fontWeight: 700,
                    lineHeight: '24px',
                    letterSpacing: '0.01em',
                }}>
                    Analytics
                </Typography>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                }}>
                    <Box sx={{
                        width: 10,
                        height: 10,
                        background: '#B3FC4F',
                        borderRadius: '2px',
                    }} />
                    <Typography variant='h6' sx={{
                        fontSize: 12,
                        color: '#FDFCFF',
                        fontWeight: 500,
                        letterSpacing: '0.01em',
                        marginLeft: '8px',
                    }}>
                        {!isSelectedCity ?
                            'Avg temperature in all cities' :
                            `Avg temperature in the city of ${selectedCity}`}
                    </Typography>
                </Box>
            </Box>
            <Box sx={{
                height: 'calc(100% - 24px)',
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        width={500}
                        height={300}
                        data={dataToRender}
                        margin={{
                            top: 22,
                            right: 24,
                            left: 0,
                            bottom: 12,
                        }}
                        barCategoryGap="78%"
                    >
                        <defs>
                            <linearGradient
                                id="colorUv"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="100%"
                                spreadMethod="reflect"
                            >
                                <stop offset="0" stopColor="#B3FC4F" />
                                <stop offset="100%" stopColor="#173102" />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false}
                            stroke="#313131"
                            strokeDasharray="7"
                        />
                        <XAxis dataKey="dayName"
                            axisLine={false}
                            tickLine={false}
                            interval={0}
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                fill: '#FDFCFF',
                            }}
                        />
                        <YAxis axisLine={false}
                            tickLine={false}
                            height={100}
                            style={{
                                fontSize: 14,
                                fontWeight: 500,
                                fill: '#A4A4A4',
                            }}
                        />
                        <Bar
                            dataKey={!isSelectedCity ? "averageWeekTemp" : "averageDayTemp"}
                            fill="url(#colorUv)"
                            radius={[8, 8, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </Box>
        </Box>
    );
};

export default Chart;