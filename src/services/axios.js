// src/services/axios.js
import axios from "axios";
 const API_URL = "https://edu-crm-backend-1.onrender.com/api/v1";
//const API_URL = import.meta.env.VITE_API_URL ||  "http://localhost:3000/api/v1" || "https://edu-crm-backend-1.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_URL
});

// Request interceptor - HAR BIR so'rovga TOKEN QO'SHADI
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - 401 xatolikda login sahifasiga o'tkazadi
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;