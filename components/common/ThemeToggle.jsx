"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme, setTheme } from "@/redux/slices/uiSlice";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const [mounted, setMounted] = useState(false);

  // Sync with localStorage on client mount
  useEffect(() => {
    setMounted(true);
    try {
      const storedTheme = localStorage.getItem("saral-theme");
      if (storedTheme === "light" || storedTheme === "dark") {
        if (storedTheme !== theme) {
          dispatch(setTheme(storedTheme));
        }
        if (storedTheme === "dark") {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
      } else {
        const isCurrentlyDark = document.documentElement.classList.contains("dark");
        dispatch(setTheme(isCurrentlyDark ? "dark" : "light"));
        localStorage.setItem("saral-theme", isCurrentlyDark ? "dark" : "light");
      }
    } catch (e) {}
  }, [dispatch]);

  // Whenever theme state changes, sync DOM and localStorage
  useEffect(() => {
    if (!mounted) return;
    try {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
        localStorage.setItem("saral-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("saral-theme", "light");
      }
    } catch (e) {}
  }, [theme, mounted]);

  const handleToggle = () => {
    dispatch(toggleTheme());
  };

  const isDark = theme === "dark";

  return (
    <motion.button
      type="button"
      onClick={handleToggle}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      title={isDark ? "Switch to Civic Light Theme" : "Switch to Deep Dark Theme"}
      aria-label="Toggle Theme"
      className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-slate-100 hover:bg-slate-200/80 border border-slate-300/80 dark:bg-white/10 dark:hover:bg-white/15 dark:border-white/15 text-slate-700 dark:text-purple-200 shadow-sm transition-colors cursor-pointer"
    >
      {isDark ? (
        // Sun Icon for Dark Mode (click to switch to Light)
        <motion.svg
          key="sun"
          initial={{ rotate: -90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: 90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-4.5 h-4.5 text-amber-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
          />
        </motion.svg>
      ) : (
        // Moon Icon for Light Mode (click to switch to Dark)
        <motion.svg
          key="moon"
          initial={{ rotate: 90, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          exit={{ rotate: -90, scale: 0.6, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="w-4.5 h-4.5 text-indigo-600"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"
          />
        </motion.svg>
      )}
    </motion.button>
  );
}
