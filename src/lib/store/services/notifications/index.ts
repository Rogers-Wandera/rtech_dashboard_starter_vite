import { UploadCompleteType } from "@/types/server/server.main.types";
import { createSlice } from "@reduxjs/toolkit";

export type NotificationTypes = {
  uploads: {
    data: UploadCompleteType[];
    count?: number;
  };
};

const initialState: NotificationTypes = {
  uploads: { data: [], count: 0 },
};

const notificationSlice = createSlice({
  name: "notification",
  initialState: initialState,
  reducers: {
    setUploadNotifications: (
      state,
      action: { payload: UploadCompleteType }
    ) => {
      action.payload["read"] = false;
      const count = state.uploads.data.reduce((acc, curlValue) => {
        if (!curlValue?.read) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);
      state.uploads = {
        data: [...state.uploads.data, action.payload],
        count: count + 1,
      };
    },

    updateUploadRead: (
      state,
      { payload }: { payload: "Mark_AS_READ" | { filename: string } }
    ) => {
      if (payload === "Mark_AS_READ") {
        state.uploads.data = state.uploads.data.map((upload) => ({
          ...upload,
          read: true,
        }));
      } else if (typeof payload === "object" && payload.filename) {
        const { filename } = payload;
        state.uploads.data = state.uploads.data.map((upload) =>
          upload.filename === filename ? { ...upload, read: true } : upload
        );
      }
    },
  },
});

export const { setUploadNotifications, updateUploadRead } =
  notificationSlice.actions;
export default notificationSlice.reducer;
