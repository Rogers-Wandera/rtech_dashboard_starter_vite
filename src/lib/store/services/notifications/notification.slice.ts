import { createSlice } from "@reduxjs/toolkit";
import { notificationApi } from "./notification.api";
import {
  Notifications,
  PaginateResponse,
} from "@/types/server/server.main.types";

const defaultState: PaginateResponse<any> = {
  docs: [],
  totalDocs: 0,
  totalPages: 0,
  page: 0,
  hasNextPage: false,
  hasPrevPage: false,
};
const initialState: Notifications = {
  unread: defaultState,
  sent: defaultState,
  failed: defaultState,
  read: defaultState,
  system: defaultState,
  schedule: defaultState,
  all: defaultState,
  urgent: defaultState,
  expired: defaultState,
  annoucements: defaultState,
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      notificationApi.endpoints.getNotifications.matchFulfilled,
      (state, action) => {
        const data = action.payload;
      }
    );
    builder.addMatcher(
      notificationApi.endpoints.getMainNotifications.matchFulfilled,
      (state, action) => {
        const data = action.payload;
      }
    );
  },
});

export const notificationReducer = notificationSlice.reducer;
export const {} = notificationSlice.actions;
