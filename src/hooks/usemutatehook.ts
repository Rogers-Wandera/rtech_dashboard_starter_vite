import { useMutation } from "@tanstack/react-query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import {
  ServerErrorResponse,
  ServerResponse,
} from "@/types/server/server.main.types";
import { useAuth } from "./auth.hooks";
import { USE_MUTATE_METHODS } from "@/types/enums/enum.types";

type UsePostDataProps = {
  queryKey: string | any[];
  onlyAuth?: boolean;
  configs?: AxiosRequestConfig;
};

type noUrl = {
  endPoint: string;
  url?: never;
};

type withUrl = {
  url: string;
  endPoint?: never;
};

type PatchType<T = unknown> = { payload: T; method?: USE_MUTATE_METHODS.PATCH };
type PutType<T = unknown> = { payload: T; method?: USE_MUTATE_METHODS.PUT };
type PostType<T = unknown> = { payload: T; method?: USE_MUTATE_METHODS.POST };
type DeleteType<T = unknown> = {
  payload?: T;
  method?: USE_MUTATE_METHODS.DELETE;
};

export type PostDataPayload<T = unknown> =
  | (noUrl | withUrl) &
      (PatchType<T> | PutType<T> | PostType<T> | DeleteType<T>) & {
        setUrlOptions?: (url: URL) => URL;
      };

export function useMutateData<T = ServerResponse, P = unknown>({
  queryKey,
  configs = {},
  onlyAuth = true,
}: UsePostDataProps) {
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
    PostDataPayload<P>
  >({
    mutationKey: [queryKey],
    mutationFn: async ({
      url,
      setUrlOptions,
      endPoint,
      payload,
      method = USE_MUTATE_METHODS.POST,
    }: PostDataPayload<P>) => {
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
        const response = await axios<T>({
          ...configs,
          url: postUrl.href,
          data: payload,
          method: method,
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
    post: mutation.mutate, // Triggers the mutation
    postAsync: mutation.mutateAsync, // For using with async/await
  };
}
