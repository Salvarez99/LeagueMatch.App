import axios from "axios";
import { getAuthToken } from "./getAuthToken";
import { apiBaseUrl } from "../config";

const axiosClient = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback;

  if (!error.response) {
    return "The server could not be reached. Check that the backend is running and try again.";
  }

  const status = error.response.status;
  const responseData = error.response.data;
  const serverMessage =
    typeof responseData === "string" ? responseData : responseData?.message;
  const serverCode =
    typeof responseData === "object" ? responseData?.code : undefined;
  const details =
    typeof responseData === "object" ? responseData?.details : undefined;
  const context = [serverCode, details].filter(Boolean).join(" - ");
  const describe = (message: string) =>
    context ? `${message} [${context}]` : message;

  if (status === 400) {
    return describe(
      serverMessage || "Check that your Riot ID and tagline are correct.",
    );
  }
  if (status === 401) {
    return describe("Your sign-in session expired. Sign in again and retry.");
  }
  if (status === 404) {
    return describe(
      serverMessage ||
        "That Riot account could not be found. Check the spelling and tagline.",
    );
  }
  if (status === 502) {
    return describe(
      `${serverMessage || "Riot's account service could not complete the request."} Check the Riot ID and try again in a moment.`,
    );
  }
  if (status === 503) {
    return "The Riot integration is not configured on the backend. Check the server environment settings.";
  }

  return describe(serverMessage || `${fallback} (HTTP ${status})`);
};

axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.warn("Authenticated API request skipped: no Firebase user");
    }
    return config;
  },
  (error) => Promise.reject(error),
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
  },
);

export default axiosClient;
