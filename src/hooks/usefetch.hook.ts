import { keepPreviousData, useQuery } from "@tanstack/react-query";
import axios, { AxiosError, AxiosRequestConfig } from "axios";
import {
  IPaginate,
  PaginateResponse,
  ServerErrorResponse,
} from "@/types/server/server.main.types";
import { useMRTTableContext } from "@/lib/context/table/mrttable.context";
import { useAuth } from "./auth.hooks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { notifier } from "@/lib/utils/notify/notification";
// import { usePaginateContext } from "@/lib/context/paginate/paginate.context";

type props = {
  queryKey: string | any[];
  url?: string;
  endPoint?: string;
  configs?: AxiosRequestConfig;
  setUrlOptions?: (url: URL) => URL;
  manual: boolean;
  afterFetch?: () => void | Promise<void>;
  beforeFetch?: () => void | Promise<void>;
  withAuth?: boolean;
};

export function useFetch<T = any>({
  queryKey,
  setUrlOptions = undefined,
  manual = true,
  url = undefined,
  endPoint = "",
  configs = {},
  beforeFetch = undefined,
  afterFetch = undefined,
  withAuth = false,
}: props) {
  const prefix = import.meta.env.VITE_SERVER_PREFIX;
  const mainurl = url
    ? url
    : import.meta.env.VITE_SERVER_URL + `${prefix}/${endPoint}`;

  let fetchUrl = new URL(mainurl);
  if (setUrlOptions) {
    fetchUrl = setUrlOptions(new URL(mainurl));
  }

  const { token } = useAuth();
  if (withAuth) {
    configs.headers = {
      ...configs.headers,
      Authorization: `Bearer ${token}`,
    };
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
        if (beforeFetch) {
          if (beforeFetch.constructor.name === "AsyncFunction") {
            await beforeFetch();
          } else {
            beforeFetch();
          }
        }
        const response = await axios.get<T>(fetchUrl.href, configs);
        if (afterFetch) {
          afterFetch();
        }
        return response.data;
      } catch (error) {
        const err = error as AxiosError<ServerErrorResponse>;
        if (err) {
          return Promise.reject(err.response?.data);
        }
        throw error;
      }
    },
    placeholderData: keepPreviousData,
    enabled: manual,
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
    sorting,
    filters,
    status,
    data: tableData,
    manual,
    setManual,
  } = useMRTTableContext<T>();
  const { token } = useAuth();

  const setUrlOptions = useCallback(
    (url: URL) => {
      url.searchParams.set(
        "page",
        (pagination.pagination.pageIndex + 1).toString()
      );
      url.searchParams.set("limit", pagination.pagination.pageSize.toString());
      url.searchParams.set(
        "filters",
        JSON.stringify(filters.columnFilters ?? [])
      );
      url.searchParams.set("globalFilter", filters.globalFilter ?? "");
      url.searchParams.set("sortBy", JSON.stringify(sorting.sorting));
      return url;
    },
    [
      pagination.pagination,
      sorting.sorting,
      filters.columnFilters,
      filters.globalFilter,
    ]
  );
  let canfetch = false;
  if (onlyAuth) {
    if (token && token?.length > 0) {
      canfetch = true;
      configs = {
        ...configs,
        headers: { ...configs?.headers, Authorization: `Bearer ${token}` },
      };
    } else {
      canfetch = false;
    }
  }

  const newqueryKey = useMemo(
    () => [
      queryKey,
      pagination.pagination.pageIndex,
      pagination.pagination.pageSize,
      filters.columnFilters,
      filters.globalFilter,
      sorting.sorting,
    ],
    [
      pagination.pagination,
      filters.columnFilters,
      filters.globalFilter,
      sorting.sorting,
    ]
  );

  const { data, isError, isRefetching, isLoading, refetch, isFetching, error } =
    useFetch<PaginateResponse<T>>({
      endPoint,
      queryKey: newqueryKey,
      configs,
      setUrlOptions,
      manual: canfetch && manual,
      afterFetch: () => {
        setManual(false);
      },
    });

  useEffect(() => {
    if (onlyAuth && token && token?.length > 0) {
      if (isError && error) {
        notifier.error({ message: error.message });
      }
    }
    status.setIsError(isError);
    status.setIsLoading(isLoading);
    status.setIsFetching(isFetching);
    tableData.setData(data);
    status.setError(error);
  }, [isError, isLoading, isFetching, data, error]);

  useEffect(() => {
    if (isError) {
      setManual(false);
      tableData.setData(undefined);
    }
  }, [isError]);

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
  configs,
  endPoint,
  onlyAuth = true,
  limit = 5,
  url = undefined,
  showError = true,
}: getprops & {
  limit?: number;
  url?: string;
  showError?: boolean;
}) {
  const [paginate, setPaginate] = useState<IPaginate<T>>({
    page: 1,
    limit: limit,
    globalFilter: null,
    sortBy: [],
    filters: [],
    conditions: null,
  });

  const [manual, setManual] = useState(true);
  const { token } = useAuth();
  const setUrlOptions = useCallback(
    (url: URL) => {
      url.searchParams.set("page", JSON.stringify(paginate.page));
      url.searchParams.set("limit", JSON.stringify(paginate.limit));
      url.searchParams.set("filters", JSON.stringify(paginate.filters ?? []));
      url.searchParams.set("globalFilter", paginate.globalFilter ?? "");
      url.searchParams.set("sortBy", JSON.stringify(paginate.sortBy));
      return url;
    },
    [paginate]
  );

  let canfetch = true;
  if (onlyAuth) {
    if (token && token?.length > 0) {
      canfetch = true;
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
      manual: canfetch && manual,
      url,
    });

  useEffect(() => {
    if (onlyAuth && token && token?.length > 0) {
      if (isError && error && showError) {
        notifier.error({ message: error.message });
      }
    }
  }, [isError, error, onlyAuth, token]);

  useEffect(() => {
    refetch();
  }, [paginate]);

  useEffect(() => {
    setPaginate((prevState) => ({ ...prevState, limit: limit }));
  }, [limit]);

  useEffect(() => {
    if (!isLoading && !isFetching && isError) {
      setManual(false);
    }
  }, [isLoading, isFetching]);

  return {
    data,
    isError,
    isRefetching,
    isLoading,
    refetch,
    isFetching,
    error,
    paginate,
    setPaginate,
    setManual,
  };
}
