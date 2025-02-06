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
  createTransform,
} from "redux-persist";
import { thunk } from "redux-thunk";
import SettingReducer from "./settings/dasboardsettings/reducers";
import { defaultReducer } from "./services/defaults/defaults";
import { setupListeners } from "@reduxjs/toolkit/query";
import storage from "./storage";
import { AuthApi } from "./services/auth/auth.api";
import { AuthReducer } from "./services/auth/auth.slice";
import NotificationReducer from "./services/notifications/index";
import CryptoJS from "crypto-js";

const encryptionKey = import.meta.env.VITE_LOCAL_ENCRYPTION;

const encryptTransform = createTransform(
  (inboundState) => {
    return {
      data: CryptoJS.AES.encrypt(
        JSON.stringify(inboundState),
        encryptionKey
      ).toString(),
    };
  },
  (outboundState) => {
    if (!outboundState?.data) return undefined; // Handle missing data
    try {
      const bytes = CryptoJS.AES.decrypt(outboundState.data, encryptionKey);
      return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    } catch (error) {
      console.error("Decryption failed:", error);
      return undefined;
    }
  },
  { whitelist: ["authuser", "defaultstate", "notification"] }
);

const persistConfig = {
  key: "root",
  storage: storage,
  transforms: [encryptTransform],
};

const rootReducers = combineReducers({
  authuser: AuthReducer,
  defaultstate: defaultReducer,
  notification: NotificationReducer,
});

export type RootReducer = ReturnType<typeof rootReducers>;

const persistedReducer = persistReducer<RootReducer>(
  persistConfig,
  rootReducers
);

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
