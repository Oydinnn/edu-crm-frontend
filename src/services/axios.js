// src/services/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
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