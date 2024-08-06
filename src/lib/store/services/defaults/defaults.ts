import { Action, createAction, createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "../auth/auth.api";

export const revertAll = createAction("REVERT_ALL");
export interface DefaultState {
  headerText: string;
  isLoading: boolean;
  session: boolean;
}

const defaultState: DefaultState = {
  headerText: "",
  isLoading: false,
  session: false,
};
const defaultSlice = createSlice({
  name: "defaultslice",
  initialState: defaultState,
  reducers: {
    setHeaderText: (state, action: { payload: string }) => {
      state.headerText = action.payload;
    },
    setLoading: (state, action: { payload: boolean }) => {
      state.isLoading = action.payload;
    },
    setSession: (state, action: { payload: boolean }) => {
      state.session = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(revertAll, () => defaultState)
      .addMatcher(
        (action: Action) =>
          action.type.endsWith("/pending") &&
          action.type.startsWith(AuthApi.reducerPath),
        (state) => {
          state.isLoading = true;
        }
      )
      .addMatcher(
        (action: Action) =>
          (action.type.endsWith("/fulfilled") ||
            action.type.endsWith("/rejected")) &&
          action.type.startsWith(AuthApi.reducerPath),
        (state) => {
          state.isLoading = false;
        }
      ),
});
export const defaultReducer = defaultSlice.reducer;
export const { setHeaderText, setLoading, setSession } = defaultSlice.actions;
