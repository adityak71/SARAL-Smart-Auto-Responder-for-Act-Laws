import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  showPassword: false,
  showConfirmPassword: false,
  notification: null,
  isSubmitting: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
    toggleShowConfirmPassword: (state) => {
      state.showConfirmPassword = !state.showConfirmPassword;
    },
    setNotification: (state, action) => {
      state.notification = action.payload;
    },
    clearNotification: (state) => {
      state.notification = null;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  toggleShowPassword,
  toggleShowConfirmPassword,
  setNotification,
  clearNotification,
  setIsSubmitting,
} = uiSlice.actions;

export default uiSlice.reducer;
