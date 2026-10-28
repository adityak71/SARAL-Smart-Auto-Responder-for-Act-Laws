import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedRole: "citizen", // "citizen" | "officer"
  isAuthenticated: false,
  user: null,
  loading: false,
  error: null,
  loginForm: {
    email: "",
    password: "",
  },
  signupForm: {
    fullName: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSelectedRole: (state, action) => {
      state.selectedRole = action.payload;
    },
    updateLoginForm: (state, action) => {
      state.loginForm = { ...state.loginForm, ...action.payload };
    },
    updateSignupForm: (state, action) => {
      state.signupForm = { ...state.signupForm, ...action.payload };
    },
    resetAuthForms: (state) => {
      state.loginForm = initialState.loginForm;
      state.signupForm = initialState.signupForm;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setCredentials: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.loginForm = initialState.loginForm;
      state.signupForm = initialState.signupForm;
    },
  },
});

export const {
  setSelectedRole,
  updateLoginForm,
  updateSignupForm,
  resetAuthForms,
  setLoading,
  setError,
  setCredentials,
  logout,
} = authSlice.actions;

export default authSlice.reducer;
