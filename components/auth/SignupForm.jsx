"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import AuthInput from "./AuthInput";
import { updateSignupForm, setCredentials } from "@/redux/slices/authSlice";
import { toggleShowPassword, toggleShowConfirmPassword } from "@/redux/slices/uiSlice";
import { signupContent } from "@/data/authContent";

export default function SignupForm() {
  const router = useRouter();
  const dispatch = useDispatch();
  const signupForm = useSelector((state) => state.auth.signupForm);
  const { showPassword, showConfirmPassword } = useSelector((state) => state.ui);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [authError, setAuthError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAuthError("");

    const fullName = (signupForm.fullName || "").trim();
    const email = (signupForm.email || "").trim().toLowerCase();
    const mobile = (signupForm.mobile || "").trim();
    const password = signupForm.password || "";
    const confirmPassword = signupForm.confirmPassword || "";

    if (!fullName) {
      setAuthError("Please enter your full name.");
      setLoading(false);
      return;
    }

    if (!email) {
      setAuthError("Please enter your email address.");
      setLoading(false);
      return;
    }

    if (!password || password.length < 6) {
      setAuthError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setAuthError("Passwords do not match. Please re-enter.");
      setLoading(false);
      return;
    }

    if (!signupForm.agreeTerms) {
      setAuthError("Please accept the Terms of Service and Privacy Policy.");
      setLoading(false);
      return;
    }

    // 1. Primary DB Registration
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          email,
          phone: mobile || null,
          password,
          role: "CITIZEN",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Registration failed. Please try again.");
      }

      // 2. Sync to Firebase in background if possible
      try {
        const { createUserWithEmailAndPassword, updateProfile } = await import("firebase/auth");
        const { auth } = await import("@/lib/firebase");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        if (userCredential?.user) {
          await updateProfile(userCredential.user, { displayName: fullName });
        }
      } catch (fbErr) {
        // DB is the primary source of truth; Firebase sync is optional
      }

      dispatch(setCredentials(data.user));
      window.location.href = "/dashboard";
      return;
    } catch (err) {
      setAuthError(err.message || "Failed to create account. Please try again.");
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setGoogleLoading(true);
    setAuthError("");
    try {
      const { signInWithPopup } = await import("firebase/auth");
      const { auth, googleProvider } = await import("@/lib/firebase");
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Provision verified citizen in database with their actual Google identity
      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          fullName: user.displayName || "Citizen User",
          avatarUrl:
            user.photoURL ||
            "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256",
          role: "CITIZEN",
          firebaseUid: user.uid,
          isDigiLockerVerified: false,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.error || "Failed to establish citizen session.");
      }

      dispatch(setCredentials(data.user));
      window.location.href = "/dashboard";
    } catch (err) {
      console.warn("Google Sign-Up Error:", err);
      let userFriendlyMsg = "Google Sign-Up failed. Please try again or use the form below.";
      if (err.code === "auth/popup-closed-by-user") {
        userFriendlyMsg = "Google sign-up popup was closed before completing.";
      } else if (err.code === "auth/unauthorized-domain") {
        const configuredUrl = process.env.NEXT_PUBLIC_APP_URL || "";
        const currentHost = typeof window !== "undefined" ? window.location.hostname : "";
        userFriendlyMsg = `Domain "${currentHost}" is not authorized in Firebase Console. Add "${currentHost}" in Firebase Console > Authentication > Settings > Authorized Domains (matching NEXT_PUBLIC_APP_URL), or register with the form below.`;
      } else if (err.code === "auth/popup-blocked") {
        userFriendlyMsg = "Google popup was blocked by your browser. Please allow popups for this site.";
      } else if (err.message) {
        userFriendlyMsg = err.message;
      }
      setAuthError(userFriendlyMsg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    dispatch(updateSignupForm({ [field]: value }));
  };

  return (
    <section
      className="w-full lg:w-[46%] xl:w-[47%] flex flex-col items-center justify-center px-4 py-3 sm:px-6 lg:px-8 xl:px-12 lg:py-2 relative z-10"
      data-purpose="registration-form-panel"
    >
      <div className="w-full max-w-[420px] sm:max-w-[440px] xl:max-w-[460px] pt-5 relative flex flex-col items-center">
        {/* White Frosted Registration Card (with adaptive Dark Mode) */}
        <motion.div
          initial={{ opacity: 0, y: 15, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-white dark:bg-[#1a2330]/95 rounded-2xl sm:rounded-2xl p-5 sm:p-6 sm:px-7 shadow-card-lift border border-slate-200/90 dark:border-white/15 relative text-slate-800 dark:text-slate-100 pt-7 sm:pt-8 transition-colors"
        >
          {/* Floating Citizen Icon Header Badge */}
          <motion.div
            initial={{ y: -14, scale: 0.7, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 350, damping: 22, delay: 0.15 }}
            whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 bg-white/95 dark:bg-[#1d2733] rounded-2xl shadow-md border border-indigo-100 dark:border-white/20 flex items-center justify-center text-indigo-600 dark:text-purple-300 cursor-pointer"
            data-purpose="citizen-badge"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
              <path
                d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.999-3.199a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          {/* Card Title & Subtitle */}
          <div className="text-center pt-1 pb-3 sm:pb-4">
            <h2 className="text-xl sm:text-[22px] font-bold text-slate-900 dark:text-white tracking-tight leading-tight">
              {signupContent.form.title}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {signupContent.form.subtitle}
            </p>
          </div>

          {/* Social Sign-Up: Google Button */}
          <div className="mb-4">
            <motion.button
              type="button"
              onClick={handleGoogleSignup}
              disabled={googleLoading || loading}
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              className="w-full min-h-[44px] py-3 sm:py-3 px-5 rounded-xl border border-slate-200/90 dark:border-white/15 bg-white dark:bg-white/[0.06] hover:bg-slate-50/90 dark:hover:bg-white/10 hover:border-slate-300 dark:hover:border-white/25 hover:shadow-md transition-colors duration-200 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 shadow-sm cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <div className="w-4.5 h-4.5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg className="w-4 h-4 sm:w-4.5 sm:h-4.5 shrink-0" viewBox="0 0 24 24">
                  <path
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.15Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.94H1.24v3.15C3.26 21.36 7.34 24 12 24Z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.28 14.26a7.14 7.14 0 0 1 0-4.52V6.59H1.24a11.97 11.97 0 0 0 0 10.82l4.04-3.15Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.24 6.59l4.04 3.15c.95-2.84 3.6-4.99 6.72-4.99Z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              <span>{googleLoading ? "Connecting with Google..." : "Continue with Google"}</span>
            </motion.button>
          </div>

          {/* Divider */}
          <div className="relative my-3 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-white/15" />
            </div>
            <span className="relative bg-white dark:bg-[#1a2330] px-3 text-xs font-normal text-slate-400 dark:text-slate-400 select-none">
              or register with email
            </span>
          </div>

          {/* Error Notice */}
          <AnimatePresence>
            {authError && (
              <motion.div
                initial={{ opacity: 0, y: -6, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -6, height: 0 }}
                className="mb-3 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs font-medium flex items-start gap-3 overflow-hidden"
              >
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                </svg>
                <span className="leading-snug">{authError}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Registration Form */}
          <form className="space-y-3 sm:space-y-3" onSubmit={handleSubmit}>
            {/* Full Name Input */}
            <AuthInput
              id="fullName"
              name="fullName"
              type="text"
              required
              value={signupForm.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder={signupContent.form.fullNamePlaceholder}
              autoComplete="name"
              icon={
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />

            {/* Email Address Input */}
            <AuthInput
              id="email"
              name="email"
              type="email"
              required
              value={signupForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={signupContent.form.emailPlaceholder}
              autoComplete="email"
              icon={
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />

            {/* Mobile Number Input */}
            <AuthInput
              id="mobile"
              name="mobile"
              type="tel"
              value={signupForm.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              placeholder={signupContent.form.mobilePlaceholder}
              autoComplete="tel"
              icon={
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />

            {/* Password Input */}
            <AuthInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={signupForm.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={signupContent.form.passwordPlaceholder}
              autoComplete="new-password"
              icon={
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 00 2.25 2.25z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              rightElement={
                <motion.button
                  type="button"
                  aria-label="Toggle password visibility"
                  whileTap={{ scale: 0.85, rotate: 10 }}
                  onClick={() => dispatch(toggleShowPassword())}
                  className="p-2 rounded-lg text-slate-400 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50/60 dark:hover:bg-white/10 focus:outline-none cursor-pointer transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.button>
              }
            />

            {/* Confirm Password Input */}
            <AuthInput
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={signupForm.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder={signupContent.form.confirmPasswordPlaceholder}
              autoComplete="new-password"
              icon={
                <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 00 2.25 2.25z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              rightElement={
                <motion.button
                  type="button"
                  aria-label="Toggle confirm password visibility"
                  whileTap={{ scale: 0.85, rotate: 10 }}
                  onClick={() => dispatch(toggleShowConfirmPassword())}
                  className="p-2 rounded-lg text-slate-400 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-300 hover:bg-purple-50/60 dark:hover:bg-white/10 focus:outline-none cursor-pointer transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                      <path
                        d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </motion.button>
              }
            />

            {/* Terms & Conditions Checkbox */}
            <div className="flex items-center gap-2 pt-0.5">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                required
                checked={signupForm.agreeTerms}
                onChange={(e) => handleInputChange("agreeTerms", e.target.checked)}
                className="w-4 h-4 rounded text-[#2c5877] border-slate-300 dark:border-white/20 focus:ring-[#2c5877] focus:ring-offset-0 cursor-pointer shrink-0 accent-[#2c5877]"
              />
              <label htmlFor="terms" className="text-xs sm:text-xs text-slate-600 dark:text-slate-300 select-none cursor-pointer leading-tight">
                {signupContent.form.termsText}{" "}
                <a href="#" className="font-semibold text-[#2c5877] dark:text-purple-300 hover:underline">
                  {signupContent.form.termsLink}
                </a>{" "}
                {signupContent.form.andText}{" "}
                <a href="#" className="font-semibold text-[#2c5877] dark:text-purple-300 hover:underline">
                  {signupContent.form.privacyLink}
                </a>
              </label>
            </div>

            {/* Primary Create Account Button */}
            <div className="pt-2 sm:pt-2">
              <motion.button
                type="submit"
                disabled={loading || googleLoading}
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: 0.985 }}
                className="w-full min-h-[46px] sm:min-h-[48px] py-3 sm:py-4 px-6 rounded-xl font-semibold text-sm sm:text-base text-white gradient-btn flex items-center justify-center gap-3 cursor-pointer group transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{signupContent.form.submitButtonText}</span>
                    <motion.svg
                      className="w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform duration-200 group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                    </motion.svg>
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {/* Divider & Secondary Sign In Link */}
          <div className="mt-4 sm:mt-4 text-center text-xs sm:text-[13px] text-slate-500 dark:text-slate-400">
            <span>{signupContent.form.haveAccountText}</span>
            <Link href="/login" className="font-bold text-[#2c5877] dark:text-purple-300 hover:text-[#2c5877] dark:hover:text-purple-200 ml-1 hover:underline">
              {signupContent.form.signinLinkText}
            </Link>
          </div>

          {/* Bottom Officer Advisory Notice Box */}
          <motion.div whileHover={{ scale: 1.01 }} className="mt-3 pt-0.5">
            <div className="bg-indigo-50/70 dark:bg-purple-950/40 border border-indigo-100 dark:border-purple-500/30 rounded-xl p-2 sm:p-3 flex items-center gap-2 text-xs sm:text-xs text-slate-700 dark:text-purple-200">
              <div className="text-indigo-600 dark:text-purple-300 shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p className="leading-tight font-normal">{signupContent.form.officerNotice}</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}