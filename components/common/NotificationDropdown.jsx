"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleNotificationDropdown,
  setNotificationDropdown,
} from "@/redux/slices/uiSlice";
import {
  setNotifications,
  markAsRead,
  markAllAsRead,
  dismissNotification,
  setNotificationFilter,
} from "@/redux/slices/notificationSlice";

function timeAgo(dateString) {
  if (!dateString) return "Just now";
  const diff = Math.max(0, Date.now() - new Date(dateString).getTime());
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationDropdown() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state) => state.ui.notificationOpen);
  const user = useSelector((state) => state.auth?.user);
  const userRole = (user?.role || "CITIZEN").toUpperCase();
  const { notifications, unreadCount, filter } = useSelector(
    (state) => state.notifications
  );

  // Sync live notifications from Supabase API on mount
  useEffect(() => {
    let isMounted = true;
    async function fetchLiveNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.notifications)) {
            const mapped = data.notifications.map((n) => ({
              id: n.id,
              title: n.title,
              message: n.message,
              category:
                n.type === "CLOCK_WARNING"
                  ? "Statutory Alert"
                  : n.type === "RESPONSE"
                  ? "Response Ready"
                  : n.type === "ASSIGNMENT"
                  ? "PIO Assigned"
                  : "System Notice",
              type:
                n.type === "CLOCK_WARNING"
                  ? "urgent"
                  : n.type === "RESPONSE"
                  ? "milestone"
                  : "update",
              appId: n.link?.includes("id=") ? n.link.split("id=")[1] : "SARAL",
              timeAgo: timeAgo(n.createdAt),
              unread: !n.isRead,
              actionLabel: n.type === "RESPONSE" ? "Download Response" : "Track Progress",
              actionLink: n.link || "/dashboard",
            }));
            if (isMounted) {
              dispatch(setNotifications(mapped));
            }
          }
        }
      } catch (err) {
        console.warn("Notifications offline fallback:", err);
      }
    }

    fetchLiveNotifications();
    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  const handleMarkAsRead = async (id) => {
    dispatch(markAsRead(id));
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notificationId: id }),
      });
    } catch (err) {
      console.warn("Mark read network error:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    dispatch(markAllAsRead());
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markAll: true }),
      });
    } catch (err) {
      console.warn("Mark all read network error:", err);
    }
  };

  const displayedNotifications =
    filter === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  return (
    <div className="relative">
      {/* Bell Button with Unread Badge */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => dispatch(toggleNotificationDropdown())}
        className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/15 text-slate-700 dark:text-purple-200 shadow-sm transition-colors cursor-pointer"
        aria-label="Open notifications"
        aria-expanded={isOpen}
      >
        <svg
          className="w-4.5 h-4.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
          />
        </svg>

        {/* Live Unread Counter Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] px-1 items-center justify-center rounded-full bg-rose-500 text-white text-xs font-extrabold ring-2 ring-white dark:ring-[#121821]">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Floating Notifications Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for mobile closing */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => dispatch(setNotificationDropdown(false))}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-[340px] sm:w-[420px] max-h-[540px] rounded-2xl bg-white dark:bg-[#1d2733]/95 border border-slate-200 dark:border-purple-500/25 z-50 flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
            >
              {/* Card Header */}
              <div className="p-4 border-b border-slate-200 dark:border-white/10 flex items-center justify-between bg-slate-50 dark:bg-slate-950/60">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm tracking-tight text-slate-900 dark:text-white">
                    {userRole === "ADMIN"
                      ? "System Notifications"
                      : userRole === "OFFICER"
                      ? "Officer Notifications"
                      : "Notifications"}
                  </span>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 rounded-lg bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 text-xs font-bold border border-rose-500/30">
                      {unreadCount} Unread
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={handleMarkAllAsRead}
                      className="text-xs text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 font-medium hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => dispatch(setNotificationDropdown(false))}
                    className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Filter Tabs */}
              <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-900/50 text-xs">
                <button
                  type="button"
                  onClick={() => dispatch(setNotificationFilter("all"))}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                    filter === "all"
                      ? "bg-purple-600 text-white font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  All ({notifications.length})
                </button>
                <button
                  type="button"
                  onClick={() => dispatch(setNotificationFilter("unread"))}
                  className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                    filter === "unread"
                      ? "bg-purple-600 text-white font-semibold"
                      : "text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  Unread ({unreadCount})
                </button>
              </div>

              {/* Notifications List */}
              <div className="overflow-y-auto max-h-[380px] p-3 space-y-3 divide-y divide-slate-100 dark:divide-slate-800/40">
                {displayedNotifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs">
                    <svg
                      className="w-10 h-10 mx-auto text-slate-400 dark:text-slate-600 mb-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.5"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <span>No unread notifications</span>
                  </div>
                ) : (
                  displayedNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`pt-3 first:pt-0 rounded-xl p-3 transition-colors relative group ${
                        notif.unread
                          ? "bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-500/20"
                          : "bg-slate-50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded-lg  tracking-wider ${
                              notif.type === "urgent"
                                ? "bg-rose-500/15 text-rose-600 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30"
                                : notif.type === "milestone"
                                ? "bg-emerald-500/15 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                                : "bg-cyan-500/15 text-cyan-600 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-500/30"
                            }`}
                          >
                            {notif.category}
                          </span>
                          <span className="text-xs font-mono text-purple-700 dark:text-purple-300/80 font-semibold">
                            {notif.appId}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-400 font-medium">
                            {notif.timeAgo}
                          </span>
                          <button
                            type="button"
                            onClick={() => dispatch(dismissNotification(notif.id))}
                            title="Dismiss notification"
                            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-500 transition"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <h4 className="text-xs font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                        {notif.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300/90 mt-1 leading-relaxed">
                        {notif.message}
                      </p>

                      <div className="flex items-center justify-between gap-2 mt-2 pt-1">
                        <Link
                          href={notif.actionLink}
                          onClick={() => {
                            handleMarkAsRead(notif.id);
                            dispatch(setNotificationDropdown(false));
                          }}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white bg-purple-100 dark:bg-purple-900/40 hover:bg-purple-200 dark:hover:bg-purple-800/60 px-3 py-1 rounded-lg border border-purple-300 dark:border-purple-500/30 transition"
                        >
                          <span>{notif.actionLabel}</span>
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </svg>
                        </Link>

                        {notif.unread && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(notif.id)}
                            className="text-xs text-slate-400 hover:text-slate-700 dark:hover:text-white transition cursor-pointer"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Card Footer */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/80 text-center">
                <Link
                  href="/tracking"
                  onClick={() => dispatch(setNotificationDropdown(false))}
                  className="text-xs font-semibold text-purple-600 dark:text-purple-300 hover:text-purple-800 dark:hover:text-purple-200 transition"
                >
                  View all active RTI tracking milestones →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
