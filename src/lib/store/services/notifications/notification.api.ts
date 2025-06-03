import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";
import { NotificationEndPoint } from "@/lib/endpoints/server.core.endpoints";
import { Notification } from "@/types/notifications/notification.types";
import {
  IPaginate,
  ServerErrorResponse,
} from "@/types/server/server.main.types";

export const notificationApi = createApi({
  reducerPath: "notificationapi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER_URL}${
      import.meta.env.VITE_SERVER_PREFIX
    }`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).appState.authuser.token;
      headers.set("Content-Type", "application/json");
      if (token && token !== "") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: ({
        userId,
        limit = 100,
        page = 1,
        globalFilter = undefined,
        sortBy = undefined,
        filters = undefined,
        conditions = undefined,
      }: Partial<IPaginate<any>> & { userId: string }) => {
        const params = new URLSearchParams();
        if (globalFilter) {
          params.set("globalFilter", globalFilter);
        }
        if (sortBy) {
          sortBy.forEach((item) => {
            params.set("sortBy[]", `${String(item.id)}:${item.desc}`);
          });
        }
        if (filters) {
          filters.forEach((item) => {
            params.set("filters[]", `${String(item.id)}:${item.value}`);
          });
        }
        if (conditions) {
          params.append("conditions", JSON.stringify(conditions));
        }
        params.set("limit", limit.toString());
        params.set("page", page.toString());
        return {
          url: `${NotificationEndPoint}/${userId}?${params.toString()}`,
        };
      },
      transformErrorResponse: (error: FetchBaseQueryError) => {
        if (error.data) {
          return error.data as ServerErrorResponse;
        }
        return error;
      },

      transformResponse: (response: Notification[]) => {
        return response;
      },
    }),
  }),
});

export const { useGetNotificationsQuery } = notificationApi;
