import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://taskflow-task-management.onrender.com/api",
  headers: {
    "Content-Type": "application/json"
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("taskflow_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
