import { createSlice } from "@reduxjs/toolkit";
import { mockRtiApplications } from "@/data/trackingData";

const initialState = {
  applications: mockRtiApplications,
  selectedApplication: mockRtiApplications[0], // Defaults to Rahul's road application
  searchQuery: "SARAL-2026-00124",
  searchStatus: "success", // "idle" | "success" | "not_found"
  statusFilter: "all",
};

export const trackingSlice = createSlice({
  name: "tracking",
  initialState,
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    searchApplication: (state, action) => {
      const query = (action.payload || state.searchQuery).trim().toUpperCase();
      const match = state.applications.find(
        (app) =>
          app.id.toUpperCase() === query ||
          app.id.toUpperCase().includes(query) ||
          app.citizenName.toUpperCase().includes(query)
      );

      if (match) {
        state.selectedApplication = match;
        state.searchStatus = "success";
      } else {
        state.searchStatus = "not_found";
      }
    },
    selectApplicationById: (state, action) => {
      const id = action.payload;
      const match = state.applications.find((app) => app.id === id);
      if (match) {
        state.selectedApplication = match;
        state.searchQuery = match.id;
        state.searchStatus = "success";
      }
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
  },
});

export const {
  setSearchQuery,
  searchApplication,
  selectApplicationById,
  setStatusFilter,
} = trackingSlice.actions;

export default trackingSlice.reducer;
