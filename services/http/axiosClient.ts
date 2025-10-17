import axios, { type AxiosError, type AxiosInstance } from "axios";
import { getAccessToken } from "../auth/tokenProvider";

const DEFAULT_TIMEOUT_MS = 30_000;

function resolveBaseURL(): string | undefined {
  if (process.env.NEXT_PUBLIC_API_BASE_URL)
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  return "/api";
}

export const axiosClient: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3033/api/v1',
  timeout: DEFAULT_TIMEOUT_MS,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  withCredentials: false,
});

axiosClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token && config.headers) {
    if (!("Authorization" in config.headers)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export default axiosClient;
