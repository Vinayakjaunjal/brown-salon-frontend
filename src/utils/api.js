import axios from "axios";
import { beginRequest, endRequest } from "./loadingBus";

const API_BASE_URL = import.meta.env.VITE_API_URL + "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// REQUEST
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (!config.headers?.["x-skip-global-loader"]) {
    beginRequest();
    config.__loaderTracked = true;
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE
api.interceptors.response.use(
  (res) => {
    if (res.config?.__loaderTracked) endRequest();
    return res;
  },
  (err) => {
    if (err.config?.__loaderTracked) endRequest();
    return Promise.reject(err);
  },
);

export default api;
