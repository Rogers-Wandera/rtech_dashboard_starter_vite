import { Action, createAction, createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "../auth/auth.api";
import { HelperClass } from "@/lib/utils/helpers/helper";

export const revertAll = createAction("REVERT_ALL");
export interface DefaultState {
  headerText: string;
  isLoading: boolean;
  session: boolean;
  rememberMe: { email: string; password: string };
}

const defaultState: DefaultState = {
  headerText: "",
  isLoading: false,
  session: false,
  rememberMe: { email: "", password: "" },
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
    setRememberMe: (state, action: { payload: typeof state.rememberMe }) => {
      const helper = new HelperClass();
      const { email, password } = action.payload;
      state.rememberMe = {
        password: password != "" ? helper.encrypt(password) : "",
        email: email != "" ? helper.encrypt(email) : "",
      };
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
export const { setHeaderText, setLoading, setSession, setRememberMe } =
  defaultSlice.actions;