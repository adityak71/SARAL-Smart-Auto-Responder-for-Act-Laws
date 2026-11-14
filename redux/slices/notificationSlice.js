import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  unreadCount: 0,
  filter: "all", // "all" | "unread"
};

export const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n) => n.unread).length;
    },
    markAsRead: (state, action) => {
      const id = action.payload;
      const notif = state.notifications.find((n) => n.id === id);
      if (notif && notif.unread) {
        notif.unread = false;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach((n) => {
        n.unread = false;
      });
      state.unreadCount = 0;
    },
    dismissNotification: (state, action) => {
      const id = action.payload;
      const target = state.notifications.find((n) => n.id === id);
      if (target && target.unread) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.notifications = state.notifications.filter((n) => n.id !== id);
    },
    setNotificationFilter: (state, action) => {
      state.filter = action.payload;
    },
  },
});

export const {
  setNotifications,
  markAsRead,
  markAllAsRead,
  dismissNotification,
  setNotificationFilter,
} = notificationSlice.actions;

export default notificationSlice.reducer;
