"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleProfileDropdown,
  setProfileDropdown,
} from "@/redux/slices/uiSlice";
import { logout } from "@/redux/slices/authSlice";
import { userProfileData } from "@/data/navigationData";

export default function ProfileDropdown() {
  const dispatch = useDispatch();
  const router = useRouter();
  const isOpen = useSelector((state) => state.ui.profileOpen);
  const selectedRole = useSelector((state) => state.auth.selectedRole);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout request:", err);
    }
    dispatch(logout());
    dispatch(setProfileDropdown(false));
    router.push("/");
    router.refresh();
  };

  const displayName = user?.name || user?.fullName || userProfileData.name;
  const displayEmail = user?.email || userProfileData.email;
  const avatarUrl = user?.avatarUrl || userProfileData.avatarUrl;
  const userRole = (user?.role || selectedRole || "CITIZEN").toUpperCase();
  const roleBadge =
    userRole === "ADMIN"
      ? "Superadmin (CIC Controller)"
      : userRole === "OFFICER"
      ? "Section 5(1) Designated PIO"
      : user?.isDigiLockerVerified
      ? "DigiLocker Verified Citizen"
      : "Verification Pending";

  return (
    <div className="relative">
      {/* Profile Avatar Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => dispatch(toggleProfileDropdown())}
        className="relative flex items-center gap-2 p-1 rounded-full bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-300/80 dark:border-white/20 shadow-sm transition-all cursor-pointer focus:outline-none"
        aria-label="User Profile Menu"
        aria-expanded={isOpen}
      >
        <div className="relative">
          <img
            src={avatarUrl}
            alt={displayName}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-purple-500/60"
          />
          {/* Online Verification Indicator */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-[#08031d]" />
        </div>

        {/* Down caret */}
        <svg
          className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-300 transition-transform hidden sm:block mr-1 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </motion.button>

      {/* Floating Profile Popover */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => dispatch(setProfileDropdown(false))}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-72 sm:w-80 rounded-2xl bg-white dark:bg-[#120930]/95 backdrop-blur-2xl border border-slate-200 dark:border-purple-500/25 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-50 overflow-hidden text-slate-800 dark:text-slate-100"
            >
              {/* Profile Card Header (Clickable to /profile) */}
              <Link
                href="/profile"
                onClick={() => dispatch(setProfileDropdown(false))}
                className="p-4 bg-gradient-to-br from-purple-700 via-indigo-700 to-purple-900 dark:from-purple-900/40 dark:via-[#130a38] dark:to-[#0c0628] border-b border-purple-600/30 dark:border-white/10 block hover:opacity-95 transition group cursor-pointer text-white"
              >
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/60 dark:ring-purple-500/80 shadow-md group-hover:ring-white transition"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 ring-2 ring-white dark:ring-[#0c0628]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-white truncate group-hover:text-purple-200 transition">
                        {displayName}
                      </h3>
                      <span className="text-[10px] text-purple-200 opacity-0 group-hover:opacity-100 transition font-semibold">
                        Edit ↗
                      </span>
                    </div>
                    <p className="text-xs text-purple-100/80 truncate">
                      {displayEmail}
                    </p>
                    <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-400/40 text-[10px] font-semibold">
                      <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{roleBadge}</span>
                    </div>
                  </div>
                </div>
              </Link>

              {/* Navigation Menu Options */}
              <div className="p-2 space-y-0.5 text-xs">
                {/* 1. View Your Profile Primary Action Link */}
                <Link
                  href="/profile"
                  onClick={() => dispatch(setProfileDropdown(false))}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 dark:bg-purple-600/15 dark:hover:bg-purple-600/25 border border-purple-200 dark:border-purple-500/30 text-purple-900 dark:text-purple-200 hover:text-purple-950 dark:hover:text-white font-semibold transition group"
                >
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:text-purple-700 dark:group-hover:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>View Your Profile</span>
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-purple-600 text-white dark:bg-purple-500/25 dark:text-purple-300 border border-purple-600 dark:border-purple-500/30 shadow-xs">
                    Live
                  </span>
                </Link>

                {/* Role Specific Navigation Items */}
                <Link
                  href="/dashboard"
                  onClick={() => dispatch(setProfileDropdown(false))}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-white/5 text-slate-800 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white transition group"
                >
                  <span className="font-semibold">
                    {userRole === "ADMIN"
                      ? "Admin Governance Console"
                      : userRole === "OFFICER"
                      ? "Officer Workspace"
                      : "Citizen Dashboard"}
                  </span>
                </Link>

                <Link
                  href={userRole === "CITIZEN" ? "/tracking" : "/dashboard"}
                  onClick={() => dispatch(setProfileDropdown(false))}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-white/5 text-slate-800 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white transition group"
                >
                  <span className="font-semibold">
                    {userRole === "ADMIN"
                      ? "Public Authorities Directory"
                      : userRole === "OFFICER"
                      ? "Assigned Inward Docket"
                      : "My Filed RTIs"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-[#281552] dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-500/30">
                    {userRole === "OFFICER" ? "5 Pending" : "3 Active"}
                  </span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => dispatch(setProfileDropdown(false))}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-white/5 text-slate-800 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white transition group"
                >
                  <span className="font-semibold">
                    {userRole === "ADMIN"
                      ? "Section 25 Compliance Reports"
                      : userRole === "OFFICER"
                      ? "Section 6(3) Transfer Queue"
                      : "Drafted Applications"}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-[#281552] dark:text-purple-300 text-[10px] font-bold border border-purple-200 dark:border-purple-500/30">
                    1
                  </span>
                </Link>

                <Link
                  href="/dashboard"
                  onClick={() => dispatch(setProfileDropdown(false))}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-white/5 text-slate-800 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white transition group"
                >
                  <span className="font-semibold">Official Certified Responses</span>
                </Link>

                <Link
                  href="/profile"
                  onClick={() => dispatch(setProfileDropdown(false))}
                  className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-white/5 text-slate-800 dark:text-slate-300 hover:text-purple-700 dark:hover:text-white transition group"
                >
                  <span className="font-semibold">Account & Preferences</span>
                </Link>
              </div>

              {/* Role Indicator & Actions */}
              <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">
                  Role: <strong className="text-slate-900 dark:text-white uppercase">{userRole}</strong>
                </span>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-rose-600 dark:text-rose-400 hover:text-rose-800 dark:hover:text-rose-300 font-semibold hover:underline cursor-pointer"
                >
                  Log out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
