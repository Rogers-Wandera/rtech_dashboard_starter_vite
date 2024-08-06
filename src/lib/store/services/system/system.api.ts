import { SystemEndPoint } from "@/lib/endpoints/server.core.endpoints";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { RootState } from "../../store";

export const SystemApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_SERVER_URL}${process.env.NEXT_PUBLIC_SERVER_PREFIX}`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).appState.authuser.token;
      headers.set("Content-Type", "application/json");
      if (token && token !== "") {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  reducerPath: "systemapi",
  endpoints: (builder) => ({
    getModules: builder.query({
      query: () => ({
        url: `${SystemEndPoint}/modules`,
      }),
    }),
  }),
});

export const { useGetModulesQuery } = SystemApi;
