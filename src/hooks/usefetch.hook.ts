import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  IPaginate,
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import { useAuth } from "./auth.hooks";
import { useEffect } from "react";
import { notifier } from "@/lib/utils/notify/notification";
import { usePaginateContext } from "@/lib/context/paginate/paginate.context";

type props = {
  queryKey: string | any[];
  url?: string;
  endPoint?: string;
  configs?: AxiosRequestConfig;
  setUrlOptions?: (url: URL) => URL;
  canfetch?: boolean | null;
};

export function useFetch<T = any>({
  queryKey,
  setUrlOptions = undefined,
  url = undefined,
  endPoint = "",
  configs = {},
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
        const response = await axios.get<T>(fetchUrl.href, configs);
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

type getprops = {
  queryKey: string;
  endPoint: string;
  configs?: AxiosRequestConfig;
  onlyAuth?: boolean;
};

export function useMRTPaginateTable<T extends Record<string, any>>({
  queryKey,
  endPoint,
  onlyAuth = true,
  configs = {},
}: getprops) {
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
      configs = {
        ...configs,
        headers: { ...configs?.headers, Authorization: `Bearer ${token}` },
      };
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
      configs,
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

export function useFetchPaginate<T extends Record<string, any>>({
  queryKey,
  onlyAuth,
  configs,
  endPoint,
  limit = 5,
}: getprops & { limit?: number }) {
  const { paginate, setPaginate } = usePaginateContext<T>();
  const { token } = useAuth();
  const setUrlOptions = (url: URL) => {
    url.searchParams.set("page", JSON.stringify(paginate.page));
    url.searchParams.set("limit", JSON.stringify(paginate.limit));
    url.searchParams.set("filters", JSON.stringify(paginate.filters ?? []));
    url.searchParams.set("globalFilter", paginate.globalFilter ?? "");
    url.searchParams.set("sortBy", JSON.stringify(paginate.sortBy));
    return url;
  };

  let canfetch = null;
  if (onlyAuth) {
    if (token && token?.length > 0) {
      canfetch = null;
      configs = {
        ...configs,
        headers: { ...configs?.headers, Authorization: `Bearer ${token}` },
      };
    } else {
      canfetch = false;
    }
  }

  const { data, isError, isRefetching, isLoading, refetch, isFetching, error } =
    useFetch<PaginateResponse<T>>({
      endPoint,
      queryKey,
      configs,
      setUrlOptions,
      canfetch,
    });

  useEffect(() => {
    if (onlyAuth && token && token?.length > 0) {
      if (isError && error) {
        notifier.error({ message: error.message });
      }
    }
    setPaginate({
      page: 0,
      limit: 5,
      globalFilter: null,
      filters: [],
      sortBy: [],
    });
  }, [isError, error, onlyAuth, token]);

  useEffect(() => {
    refetch();
  }, [paginate]);

  useEffect(() => {
    setPaginate({ ...paginate, limit: limit });
  }, [limit]);
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
