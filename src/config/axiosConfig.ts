// src/api/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://178.16.131.149/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
