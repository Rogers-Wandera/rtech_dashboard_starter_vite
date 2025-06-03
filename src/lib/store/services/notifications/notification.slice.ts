import { createSlice } from "@reduxjs/toolkit";
import { notificationApi } from "./notification.api";

export type INotificationState = {};
const initialState: INotificationState = {};

export const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addMatcher(
      notificationApi.endpoints.getNotifications.matchFulfilled,
      (state, action) => {}
    );
  },
});

export const notificationReducer = notificationSlice.reducer;
export const {} = notificationSlice.actions;
