// ✅ src/utils/axiosInstance.js
import axios from "axios";

// Create instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // backend API base URL from .env
});

// Add Authorization header (if token exists)
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
