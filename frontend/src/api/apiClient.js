import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://tabibdz.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

export default apiClient;
