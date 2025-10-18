import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import axiosClient from "./axiosClient";

export type RequestConfig = AxiosRequestConfig & { 
  // Common extension point for future options
};

export type HttpError = {
  message: string;
  status?: number;
  code?: string;
  data?: unknown;
};

function toHttpError(error: unknown): HttpError {
  if (axios.isAxiosError(error)) {
    const err = error as AxiosError<any>;
    const status = err.response?.status;
    const code = err.code;
    const data = err.response?.data;
    const serverMessage =
      (typeof data === "string" && data) ||
      (typeof data === "object" && data?.message) ||
      (typeof data === "object" && data?.error) ||
      undefined;
    const message = serverMessage || err.message || "Request failed";
    return { message, status, code, data };
  }
  if (error instanceof Error) {
    return { message: error.message };
  }
  return { message: "Unknown error" };
}

async function unwrap<T>(promise: Promise<AxiosResponse<T>>): Promise<T> {
  try {
    const res = await promise;
    return res.data;
  } catch (error) {
    throw toHttpError(error);
  }
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


