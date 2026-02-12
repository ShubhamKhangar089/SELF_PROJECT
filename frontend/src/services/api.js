import axios from 'axios';

// Use environment variable in production, fallback to localhost for local dev
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default api;