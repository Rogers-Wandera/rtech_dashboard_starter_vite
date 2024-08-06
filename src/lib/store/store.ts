import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { thunk } from "redux-thunk";
import SettingReducer from "./settings/dasboardsettings/reducers";
import { defaultReducer } from "./services/defaults/defaults";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "./storage";
import { AuthApi } from "./services/auth/auth.api";
import { AuthReducer } from "./services/auth/auth.slice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducers = combineReducers({
  authuser: AuthReducer,
  defaultstate: defaultReducer,
});
const persistedReducer = persistReducer(persistConfig, rootReducers);

export const store = configureStore({
  reducer: {
    setting: SettingReducer,
    appState: persistedReducer,
    [AuthApi.reducerPath]: AuthApi.reducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      immutableCheck: false,
    })
      .concat(thunk)
      .concat(AuthApi.middleware);
  },
});

export const persistor = persistStore(store);
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
setupListeners(store.dispatch);
