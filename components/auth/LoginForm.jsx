"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import RoleSwitcher from "./RoleSwitcher";
import AuthInput from "./AuthInput";
import { updateLoginForm } from "@/redux/slices/authSlice";
import { toggleShowPassword } from "@/redux/slices/uiSlice";
import { loginContent } from "@/data/authContent";

export default function LoginForm() {
  const dispatch = useDispatch();
  const { selectedRole, loginForm } = useSelector((state) => state.auth);
  const showPassword = useSelector((state) => state.ui.showPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting login:", { role: selectedRole, ...loginForm });
  };

  const handleInputChange = (field, value) => {
    dispatch(updateLoginForm({ [field]: value }));
  };

  return (
    <section
      className="w-full lg:w-[46%] xl:w-[47%] flex flex-col items-center justify-center px-4 py-4 sm:px-6 lg:px-8 xl:px-12 lg:py-4 relative z-10"
      data-purpose="auth-container"
    >
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[420px] sm:max-w-[430px] flex flex-col items-center"
      >
        {/* Top Segmented Role Switcher: Citizen vs Officer */}
        <RoleSwitcher />

        {/* Main White Login Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="w-full bg-white rounded-3xl p-6 sm:p-8 shadow-[0_22px_55px_-12px_rgba(75,34,160,0.14),0_2px_8px_rgba(0,0,0,0.02)] border border-white text-slate-800"
          data-purpose="login-form-card"
        >
          {/* Heading */}
          <div className="mb-4 sm:mb-6">
            <h2 className="text-[26px] sm:text-[30px] font-bold text-slate-900 tracking-tight leading-tight">
              {loginContent.form.title}{" "}
              <span
                style={{ fontFamily: "var(--font-serif)" }}
                className="italic font-normal text-[#582fe0] tracking-normal text-[29px] sm:text-[33px]"
              >
                {loginContent.form.titleItalic}
              </span>
            </h2>
            <div className="min-h-[20px] mt-1 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.p
                  key={selectedRole}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18 }}
                  className="text-xs sm:text-[14px] text-slate-500 font-normal"
                >
                  {selectedRole === "officer"
                    ? "Sign in with your official officer credentials."
                    : loginContent.form.subtitle}
                </motion.p>
              </AnimatePresence>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-3 sm:space-y-3.5" onSubmit={handleSubmit}>
            {/* Email Input with hover scale & shadow */}
            <AuthInput
              id="email"
              name="email"
              type="email"
              required
              value={loginForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={loginContent.form.emailPlaceholder}
              autoComplete="email"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <path
                    d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            />

            {/* Password Input with hover scale & shadow */}
            <AuthInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={loginForm.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={loginContent.form.passwordPlaceholder}
              autoComplete="current-password"
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                  <path
                    d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
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
                  className="p-1.5 rounded-lg text-slate-400 hover:text-purple-600 hover:bg-purple-50/60 focus:outline-none cursor-pointer transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
                      <path
                        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24">
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

            {/* Forgot Password Link */}
            <div className="flex justify-end pt-0.5">
              <a
                href="#"
                className="text-xs sm:text-[13px] font-semibold text-[#5a2ee0] hover:text-[#4922b9] hover:underline transition py-0.5"
              >
                {loginContent.form.forgotPasswordText}
              </a>
            </div>

            {/* Primary Sign In Button */}
            <div className="pt-1.5 sm:pt-2">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.015, y: -1 }}
                whileTap={{ scale: 0.985 }}
                className="w-full min-h-[46px] sm:min-h-[48px] py-3 sm:py-3.5 px-5 rounded-xl font-semibold text-sm sm:text-base text-white gradient-btn flex items-center justify-center gap-2.5 shadow-[0_8px_20px_-3px_rgba(93,55,239,0.38)] hover:shadow-[0_12px_28px_-3px_rgba(93,55,239,0.48)] cursor-pointer group transition-all duration-200"
              >
                <span>{loginContent.form.submitButtonText}</span>
                <motion.svg
                  className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2] transition-transform duration-200 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                </motion.svg>
              </motion.button>
            </div>
          </form>

          {/* Divider */}
          <div className="relative my-4 sm:my-5 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <span className="relative bg-white px-3 text-xs font-normal text-slate-400 select-none">
              {loginContent.form.dividerText}
            </span>
          </div>

          {/* Social Login: Google Button */}
          <div>
            <motion.button
              type="button"
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              className="w-full min-h-[46px] sm:min-h-[48px] py-3 sm:py-3.5 px-5 rounded-xl border border-slate-200/90 bg-white hover:bg-slate-50/90 hover:border-slate-300 hover:shadow-md transition-all duration-200 flex items-center justify-center gap-3 text-sm sm:text-base font-semibold text-slate-700 shadow-sm cursor-pointer"
            >
              <svg className="w-4.5 h-4.5 sm:w-5 sm:h-5 shrink-0" viewBox="0 0 24 24">
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
              <span>{loginContent.form.googleButtonText}</span>
            </motion.button>
          </div>

          {/* Bottom Prompt */}
          <div className="mt-4 sm:mt-5 text-center">
            <p className="text-xs sm:text-[13px] text-slate-500 font-medium">
              {loginContent.form.noAccountText}{" "}
              <Link href="/signup" className="text-[#592ee0] font-semibold hover:underline ml-0.5">
                {loginContent.form.signupLinkText}
              </Link>
            </p>
          </div>
        </motion.div>

        {/* Mobile Quick App Features Footer */}
        <footer
          className="w-full mt-4 flex lg:hidden items-center justify-between text-purple-200/75 text-[11px] px-2 max-w-[380px]"
          data-purpose="mobile-features"
        >
          <div className="flex items-center space-x-1.5">
            <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>File Online</span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <div className="flex items-center space-x-1.5">
            <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Real-time Track</span>
          </div>
          <div className="h-3 w-px bg-white/20" />
          <div className="flex items-center space-x-1.5">
            <svg className="w-3.5 h-3.5 text-purple-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
            <span>Secure Response</span>
          </div>
        </footer>
      </motion.div>
    </section>
  );
}
