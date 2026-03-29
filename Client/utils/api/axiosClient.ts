import axios from "axios";
import { getAuthToken } from "./getAuthToken";

const axiosClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token was rejected — redirect to login or refresh
      console.error("Unauthorized. Redirecting to login...");
      // auth.signOut(); // optional
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
