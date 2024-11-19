import { ServerErrorResponse } from "@/types/server/server.main.types";
import axios, { AxiosError, AxiosRequestConfig } from "axios";

export const FetchData = async <T = unknown>(
  url: string,
  headers: AxiosRequestConfig["headers"] = {}
): Promise<T> => {
  try {
    const response = await axios.get<T>(url, { headers });
    return response.data;
  } catch (error) {
    const err = error as AxiosError<ServerErrorResponse>;
    if (err) {
      throw err;
    }
    throw error;
  }
};

export const validateRequired = (value: string) => !!value.length;
