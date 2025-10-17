import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axiosClient from "./axiosClient";

export type RequestConfig = AxiosRequestConfig & { 
  // Common extension point for future options
};

async function unwrap<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  const res = await promise;
  return res.data;
}

export const httpClient = {
  get<T>(url: string, config?: RequestConfig): Promise<T> {
    return unwrap<T>(axiosClient.get<T>(url, config));
  },

  post<T, B = unknown>(url: string, body?: B, config?: RequestConfig): Promise<T> {
    return unwrap<T>(axiosClient.post<T>(url, body, config));
  },

  put<T, B = unknown>(url: string, body?: B, config?: RequestConfig): Promise<T> {
    return unwrap<T>(axiosClient.put<T>(url, body, config));
  },

  patch<T, B = unknown>(url: string, body?: B, config?: RequestConfig): Promise<T> {
    return unwrap<T>(axiosClient.patch<T>(url, body, config));
  },

  delete<T>(url: string, config?: RequestConfig): Promise<T> {
    return unwrap<T>(axiosClient.delete<T>(url, config));
  },
};

export default httpClient;


