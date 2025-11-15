import axios from 'axios';
import type { WeatherData } from '../types/Weather';

const API_KEY = 'fb08110522f2092dd75fae420ae7b7c8';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export class WeatherService {
    static async getWeatherByCity(city: string, countryCode?: string): Promise<WeatherData> {
        try {
            const q = countryCode ? `${city},${countryCode}` : city;
            const url = `${BASE_URL}/weather?q=${encodeURIComponent(q)}&units=metric&lang=fr&appid=${API_KEY}`;
            const response = await axios.get(url);
            const data = response.data;
            const weather = data.weather?.[0];
            return {
                temp: data.main.temp,
                description: weather.description,
                icon: weather.icon
            };
        } catch (error) {
            console.error('WeatherService.getWeatherByCity error:', error);
            throw new Error('Impossible de récupérer la météo');
        }
    }
}
