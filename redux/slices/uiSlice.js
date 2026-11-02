import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: "dark", // "dark" | "light"
  notificationOpen: false,
  profileOpen: false,
  mobileMenuOpen: false,
  showPassword: false,
  showConfirmPassword: false,
  notificationToast: null,
  isSubmitting: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === "dark" ? "light" : "dark";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
    toggleNotificationDropdown: (state) => {
      state.notificationOpen = !state.notificationOpen;
      if (state.notificationOpen) state.profileOpen = false;
    },
    setNotificationDropdown: (state, action) => {
      state.notificationOpen = action.payload;
    },
    toggleProfileDropdown: (state) => {
      state.profileOpen = !state.profileOpen;
      if (state.profileOpen) state.notificationOpen = false;
    },
    setProfileDropdown: (state, action) => {
      state.profileOpen = action.payload;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenu: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    closeAllDropdowns: (state) => {
      state.notificationOpen = false;
      state.profileOpen = false;
      state.mobileMenuOpen = false;
    },
    toggleShowPassword: (state) => {
      state.showPassword = !state.showPassword;
    },
    toggleShowConfirmPassword: (state) => {
      state.showConfirmPassword = !state.showConfirmPassword;
    },
    setNotificationToast: (state, action) => {
      state.notificationToast = action.payload;
    },
    clearNotificationToast: (state) => {
      state.notificationToast = null;
    },
    setIsSubmitting: (state, action) => {
      state.isSubmitting = action.payload;
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleNotificationDropdown,
  setNotificationDropdown,
  toggleProfileDropdown,
  setProfileDropdown,
  toggleMobileMenu,
  setMobileMenu,
  closeAllDropdowns,
  toggleShowPassword,
  toggleShowConfirmPassword,
  setNotificationToast,
  clearNotificationToast,
  setIsSubmitting,
} = uiSlice.actions;

export default uiSlice.reducer;
