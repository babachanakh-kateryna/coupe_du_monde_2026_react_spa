import axios from 'axios';

const API_BASE_URL = 'https://worldcup2026.shrp.dev';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;