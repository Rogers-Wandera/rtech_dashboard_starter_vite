import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import { useAuth } from "./auth.hooks";
import { useEffect } from "react";
import { notifier } from "@/lib/utils/notify/notification";

type props = {
  queryKey: string | any[];
  url?: string;
  endPoint?: string;
  headers?: AxiosRequestConfig["headers"];
  setUrlOptions?: (url: URL) => URL;
  canfetch?: boolean | null;
};

export function useFetch<T = any>({
  queryKey,
  setUrlOptions = undefined,
  url = undefined,
  endPoint = "",
  headers = {},
  canfetch = null,
}: props) {
  const { manual, setManual } = useMRTTableContext();
  const prefix = import.meta.env.VITE_SERVER_PREFIX;
  const mainurl = url
    ? url
    : import.meta.env.VITE_SERVER_URL + `${prefix}/${endPoint}`;

  let fetchUrl = new URL(mainurl);
  if (setUrlOptions) {
    fetchUrl = setUrlOptions(new URL(mainurl));
  }
  const {
    data,
    isError,
    isRefetching,
    isLoading,
    refetch,
    isFetching,
    isPaused,
    isPending,
    isFetched,
    isFetchedAfterMount,
    isLoadingError,
    isPlaceholderData,
    isRefetchError,
    isStale,
    isSuccess,
    error,
  } = useQuery<T, ServerErrorResponse>({
    queryKey: [queryKey],
    queryFn: async function () {
      try {
        const response = await axios.get<T>(fetchUrl.href, {
          headers,
        });
        setManual(false);
        return response.data;
      } catch (error) {
        const err = error as AxiosError<ServerErrorResponse>;
        if (err) {
          setManual(false);
          return Promise.reject(err.response?.data);
        }
        throw error;
      }
    },
    placeholderData: keepPreviousData,
    enabled: canfetch !== null && canfetch !== undefined ? canfetch : manual,
  });

  return {
    data,
    isError,
    isRefetching,
    isLoading,
    refetch,
    isFetching,
    isPaused,
    isPending,
    isFetched,
    isFetchedAfterMount,
    isLoadingError,
    isPlaceholderData,
    isRefetchError,
    isStale,
    isSuccess,
    error,
  };
}

type tablegetprops = {
  queryKey: string;
  endPoint: string;
  headers?: AxiosRequestConfig["headers"];
  onlyAuth?: boolean;
};

export function useMRTPaginateTable<T extends Record<string, any>>({
  queryKey,
  endPoint,
  onlyAuth = true,
  headers = {},
}: tablegetprops) {
  const {
    pagination,
    columnFilters,
    globalFilter,
    sorting,
    setIsLoading,
    setData,
    setError,
    setIsError,
    setIsFetching,
  } = useMRTTableContext<T>();
  const { token } = useAuth();
  const setUrlOptions = (url: URL) => {
    url.searchParams.set("page", JSON.stringify(pagination.pageIndex));
    url.searchParams.set("limit", JSON.stringify(pagination.pageSize));
    url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
    url.searchParams.set("globalFilter", globalFilter ?? "");
    url.searchParams.set("sortBy", JSON.stringify(sorting));
    return url;
  };
  let canfetch = null;
  if (onlyAuth) {
    if (token && token?.length > 0) {
      canfetch = null;
      headers["Authorization"] = `Bearer ${token}`;
    } else {
      canfetch = false;
    }
  }

  const newqueryKey = [
    queryKey,
    pagination.pageIndex,
    pagination.pageSize,
    columnFilters,
    globalFilter,
    sorting,
  ];

  const { data, isError, isRefetching, isLoading, refetch, isFetching, error } =
    useFetch<PaginateResponse<T>>({
      endPoint,
      queryKey: newqueryKey,
      headers,
      setUrlOptions,
      canfetch,
    });

  useEffect(() => {
    if (onlyAuth && token && token?.length > 0) {
      if (isError && error) {
        notifier.error({ message: error.message });
      }
    }
    setIsError(isError);
    setIsLoading(isLoading);
    setIsFetching(isFetching);
    setData(data);
    setError(error);
  }, [isLoading, data, isError, error, onlyAuth, token, isFetching]);
  return {
    data,
    isError,
    isRefetching,
    isLoading,
    refetch,
    isFetching,
    error,
  };
}
