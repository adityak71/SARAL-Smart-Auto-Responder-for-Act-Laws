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

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout request:", err);
    }
    try {
      const { auth } = await import("@/lib/firebase");
      const { signOut } = await import("firebase/auth");
      await signOut(auth);
    } catch (e) {}
    dispatch(logout());
    dispatch(setMobileMenu(false));
    window.location.href = "/login";
  };

  const handleLinkClick = (e, link) => {
    dispatch(setMobileMenu(false));
    // If user clicks dashboard while logged out, take them directly to login
    if (link.id === "dashboard" && !isAuthenticated) {
      e.preventDefault();
      router.push("/login");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#faf8f3]/95 dark:bg-[#0f1a1f]/95 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-slate-300/30 dark:border-white/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Identity / Emblem */}
        <Link href="/" className="flex items-center gap-3 group shrink-0">
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -3, 3, 0] }}
            transition={{ duration: 0.3 }}
            className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-sm bg-purple-900 dark:bg-white/10 shadow-sm"
          >
            <div className="w-full h-full flex items-center justify-center">
              <Emblem className="w-6 h-7 text-white" />
            </div>
          </motion.div>

          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-display font-semibold text-xl text-purple-900 dark:text-white tracking-tight">
                SARAL
              </span>
              <span className="label-caps px-1 py-0.5 rounded-sm bg-[#dfeaf2] text-purple-900 dark:bg-white/10 dark:text-purple-200 border border-slate-300/40 hidden xs:inline-block">
                RTI AI
              </span>
            </div>
            <span className="text-[13px] leading-none font-medium text-slate-600 dark:text-slate-400 hidden sm:block">
              Simplifying Right to Information
            </span>
          </div>
        </Link>

        {/* Center Navigation Links (Desktop) */}
        <nav
          className="hidden md:flex items-center gap-1"
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
                className={`relative px-2.5 lg:px-3 py-1.5 rounded-sm whitespace-nowrap text-[13px] lg:text-sm transition-colors duration-200 cursor-pointer ${
                  isActive
                    ? "font-semibold text-purple-900 bg-slate-100 dark:text-white dark:bg-white/10"
                    : "font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-[#eaf5fd] dark:hover:bg-white/10"
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

          {/* 2. Notification (ONLY SHOWN WHEN LOGGED IN) */}
          {isAuthenticated && <NotificationDropdown />}

          {/* 3. Login or Logout Button */}
          {isAuthenticated ? (
            <motion.button
              type="button"
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="hidden sm:inline-flex items-center justify-center px-3 py-1.5 rounded-sm text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors duration-200 cursor-pointer"
            >
              Logout
            </motion.button>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-semibold text-white bg-purple-900 hover:bg-purple-700 dark:bg-white dark:text-purple-900 shadow-sm transition-colors duration-200 cursor-pointer"
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
            className="md:hidden w-9 h-9 rounded-sm flex items-center justify-center bg-slate-100 dark:bg-white/10 border border-slate-300/40 dark:border-white/15 text-slate-700 dark:text-slate-200 cursor-pointer"
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
            className="md:hidden border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#16262d] px-4 py-4 space-y-2 overflow-hidden shadow-lg"
          >
            <div className="flex flex-col space-y-1">
              {navigationLinks.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={(e) => handleLinkClick(e, link)}
                  className="px-4 py-3 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-purple-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition"
                >
                  {link.label}
                </Link>
              ))}

              {isAuthenticated && (
                <Link
                  href="/profile"
                  onClick={() => dispatch(setMobileMenu(false))}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-purple-600 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30 flex items-center justify-between transition"
                >
                  <span>View Your Profile</span>
                  <span className="text-xs">→</span>
                </Link>
              )}
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between">
              {isAuthenticated ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-center py-3 rounded-xl font-semibold text-sm bg-rose-600 hover:bg-rose-700 text-white shadow-md transition cursor-pointer"
                >
                  Log Out
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => dispatch(setMobileMenu(false))}
                  className="w-full text-center py-3 rounded-xl font-semibold text-sm bg-purple-600 hover:bg-purple-700 text-white shadow-md transition"
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
