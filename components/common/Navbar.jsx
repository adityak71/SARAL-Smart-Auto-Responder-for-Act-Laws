"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import Emblem from "@/components/common/Emblem";
import ThemeToggle from "@/components/common/ThemeToggle";
import NotificationDropdown from "@/components/common/NotificationDropdown";
import ProfileDropdown from "@/components/common/ProfileDropdown";
import { navigationLinks } from "@/data/navigationData";
import { toggleMobileMenu, setMobileMenu } from "@/redux/slices/uiSlice";
import { logout } from "@/redux/slices/authSlice";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();

  const isMobileMenuOpen = useSelector((state) => state.ui.mobileMenuOpen);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(setMobileMenu(false));
    router.push("/");
  };

  const handleLinkClick = (e, link) => {
    dispatch(setMobileMenu(false));
    // If user clicks dashboard while logged out, take them to login
    if (link.id === "dashboard" && !isAuthenticated) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/90 dark:bg-[#08031d]/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.35)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Identity / Emblem */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-500 p-0.5 shadow-[0_0_20px_rgba(147,51,234,0.35)]"
          >
            <div className="w-full h-full bg-[#0d062e] rounded-[10px] flex items-center justify-center">
              <Emblem className="w-6 h-7 text-white" />
            </div>
          </motion.div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl text-slate-900 dark:text-white tracking-tight uppercase">
                SARAL
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/15 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 border border-purple-500/30 hidden xs:inline-block">
                RTI AI
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-medium text-slate-500 dark:text-slate-400 tracking-wide uppercase hidden sm:block">
              Simplifying Right to Information
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-1 p-1.5 rounded-full bg-slate-100/90 dark:bg-white/5 border border-slate-200/80 dark:border-white/10 backdrop-blur-md shadow-inner"
          aria-label="Main Navigation"
        >
          {navigationLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : link.href.startsWith("/#")
                ? false // Anchors on homepage don't color highlight unless user navigates
                : pathname === link.href || (pathname.startsWith(link.href + "/") && link.href !== "/");

            return (
              <Link
                key={link.id}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link)}
                className={`relative px-3.5 py-1.5 rounded-full text-xs sm:text-[13px] font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-white bg-purple-600 shadow-[0_2px_12px_rgba(147,51,234,0.4)]"
                    : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Header Actions: Theme Switch -> Notification -> Login/Logout Button -> Profile Picture */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 1. Theme Switch (Logo / Icon only) */}
          <ThemeToggle />

          {/* 2. Notification (Logo with Live Unread Badge + Popup Dropdown) */}
          <NotificationDropdown />

          {/* 3. Login or Logout Button */}
          {isAuthenticated ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-rose-600 dark:text-rose-300 hover:text-white hover:bg-rose-600 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 shadow-sm transition-all duration-200 cursor-pointer"
            >
              Logout
            </motion.button>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-300/80 dark:border-white/15 hover:border-purple-400/50 shadow-sm transition-all duration-200 cursor-pointer"
            >
              Login
            </Link>
          )}

          {/* 4. Profile Logo with Shown Profile Picture (ONLY SHOWN WHEN LOGGED IN) */}
          {isAuthenticated && <ProfileDropdown />}

          {/* Mobile Hamburger Button */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => dispatch(toggleMobileMenu())}
            className="md:hidden w-9 h-9 rounded-xl flex items-center justify-center bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-700 dark:text-slate-200 cursor-pointer"
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Dropdown Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#0c0529] px-4 py-4 space-y-2 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  href="/profile"
                  onClick={() => dispatch(setMobileMenu(false))}
                  className="px-3.5 py-2.5 rounded-xl text-sm font-semibold text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 flex items-center justify-between transition"
                >
                  <span>👤 View Your Profile</span>
                  <span className="text-xs">→</span>
                </Link>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => dispatch(setMobileMenu(false))}
                  className="w-full text-center py-2.5 rounded-xl font-semibold text-sm bg-purple-600 hover:bg-purple-700 text-white shadow-md transition"
                >
                  Sign In to Citizen / Officer Portal
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
