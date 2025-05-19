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

export const validateRequired = (value: string) => value && !!value.length;

export function formatPropertyName(propName: string) {
  // Step 1: Insert space before capital letters
  const withSpaces = propName.replace(/([A-Z])/g, " $1");
  // Step 2: Capitalize the first letter of each word
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}
