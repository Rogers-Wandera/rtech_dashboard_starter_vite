import { IAuthState, IAuthUser } from "@/types/server/server.main.types";
import { createSlice } from "@reduxjs/toolkit";
import { AuthApi } from "./auth.api";
import { jwtDecode } from "jwt-decode";
import { UserModuleRes } from "@/types/server/server.main.types";
import { TypeToken } from "@/types/app/auth/auth.types";

const initialState: IAuthState = {
  isLoggedIn: false,
  token: null,
  user: null,
  modules: {},
};

export const AuthSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    setLoggedIn: (state, action: { payload: boolean }) => {
      state.isLoggedIn = action.payload;
    },
    setToken: (state, action: { payload: string }) => {
      state.token = action.payload;
    },
    setUser: (state, action: { payload: IAuthUser }) => {
      state.user = action.payload;
    },
    setModules: (state, action: { payload: UserModuleRes }) => {
      state.modules = action.payload;
    },
    logOut: () => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(AuthApi.endpoints.Login.matchFulfilled, (state, action) => {
        state.isLoggedIn = true;
        state.token = action.payload.accessToken;
        const decodeToken = jwtDecode<TypeToken>(action.payload.accessToken);
        state.user = decodeToken.user;
      })
      .addMatcher(
        AuthApi.endpoints.getUserModules.matchFulfilled,
        (state, action) => {
          state.modules = action.payload;
        }
      );
  },
});

export const AuthReducer = AuthSlice.reducer;
export const { setLoggedIn, setToken, logOut } = AuthSlice.actions;
