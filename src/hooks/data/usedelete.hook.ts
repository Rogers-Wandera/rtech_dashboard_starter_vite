import { useMutation } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { ServerErrorResponse } from "@/types/server/server.main.types";
import { useAuth } from "../auth/auth.hooks";

type UseDeleteDataProps = {
  queryKey: string | any[];
  onlyAuth?: boolean;
  configs?: AxiosRequestConfig;
};

type noUrl = {
  url?: never;
  endPoint: string;
};

type withUrl = {
  url?: string;
  endPoint: never;
};

type DeleteDataPayload<T = unknown> = (noUrl | withUrl) & {
  setUrlOptions?: (url: URL) => URL;
  payload?: T;
};
export function useDeleteData<T = any, P = unknown>({
  queryKey,
  configs = {},
  onlyAuth = true,
}: UseDeleteDataProps) {
  const { token } = useAuth();
  const prefix = import.meta.env.VITE_SERVER_PREFIX;
  if (onlyAuth) {
    configs = {
      ...configs,
      headers: { ...configs?.headers, Authorization: `Bearer ${token}` },
    };
  }
  const mutation = useMutation<
    T,
    AxiosError<ServerErrorResponse>,
    DeleteDataPayload<P>
  >({
    mutationKey: [queryKey],
    mutationFn: async ({
      url,
      setUrlOptions,
      endPoint,
      payload,
    }: DeleteDataPayload) => {
      try {
        const mainurl = url
          ? url
          : import.meta.env.VITE_SERVER_URL +
            `${prefix}/${
              endPoint
                ? endPoint.startsWith("/")
                  ? endPoint.slice(1)
                  : endPoint
                : ""
            }`;
        let postUrl = new URL(mainurl);
        if (setUrlOptions) {
          postUrl = setUrlOptions(new URL(mainurl));
        }
        const response = await axios.delete<T>(postUrl.href, {
          ...configs,
          data: payload,
        });
        return response.data;
      } catch (error) {
        const err = error as AxiosError<ServerErrorResponse>;
        if (err) {
          return Promise.reject(err.response?.data);
        }
        throw error;
      }
    },
  });

  return {
    ...mutation,
    Delete: mutation.mutate, // Triggers the mutation
    deleteAsync: mutation.mutateAsync, // For using with async/await
  };
}
