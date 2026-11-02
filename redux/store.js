import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import uiReducer from "./slices/uiSlice";
import notificationReducer from "./slices/notificationSlice";
import trackingReducer from "./slices/trackingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    notifications: notificationReducer,
    tracking: trackingReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});
