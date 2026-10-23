import axios from 'axios';

// Single place for API configuration. Cookies are sent for the HTTP-only JWT (Step 2).
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
  timeout: 20000,
});

export default api;
