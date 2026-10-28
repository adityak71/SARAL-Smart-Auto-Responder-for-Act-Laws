"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { updateSignupForm } from "@/redux/slices/authSlice";
import { toggleShowPassword, toggleShowConfirmPassword } from "@/redux/slices/uiSlice";
import { signupContent } from "@/data/authContent";

export default function SignupForm() {
  const dispatch = useDispatch();
  const signupForm = useSelector((state) => state.auth.signupForm);
  const { showPassword, showConfirmPassword } = useSelector((state) => state.ui);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting citizen registration:", signupForm);
  };

  const handleInputChange = (field, value) => {
    dispatch(updateSignupForm({ [field]: value }));
  };

  return (
    <section
      className="w-full lg:w-120 xl:w-125 flex items-center justify-center self-center z-10 px-4 py-4 sm:p-6 lg:p-0 my-3 sm:my-6 lg:my-auto"
      data-purpose="registration-form-panel"
    >
      {/* White Frosted Registration Card */}
      <motion.div
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-107.5 lg:max-w-none bg-[#f8fafc]/95 backdrop-blur-xl rounded-[26px] sm:rounded-[28px] p-5 sm:p-9 shadow-card-lift border border-white/80 relative text-slate-800"
      >
        {/* Floating Citizen Icon Header Badge */}
        <motion.div
          initial={{ y: -16, scale: 0.7, opacity: 0 }}
          animate={{ y: 0, scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 350, damping: 22, delay: 0.15 }}
          whileHover={{ scale: 1.08, rotate: [0, -5, 5, 0] }}
          className="absolute -top-6 sm:-top-7 left-1/2 -translate-x-1/2 w-12 h-12 sm:w-14 sm:h-14 bg-white/95 rounded-2xl shadow-md border border-indigo-100 flex items-center justify-center text-indigo-600 cursor-pointer"
          data-purpose="citizen-badge"
        >
          <svg className="w-6 h-6 sm:w-7 sm:h-7" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
            <path
              d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.999-3.199a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>

        {/* Card Title & Subtitle */}
        <div className="text-center pt-2 sm:pt-3 pb-4 sm:pb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {signupContent.form.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {signupContent.form.subtitle}
          </p>
        </div>

        {/* Registration Form */}
        <form className="space-y-3 sm:space-y-3.5" onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="relative">
            <label className="sr-only" htmlFor="fullName">
              {signupContent.form.fullNamePlaceholder}
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              value={signupForm.fullName}
              onChange={(e) => handleInputChange("fullName", e.target.value)}
              placeholder={signupContent.form.fullNamePlaceholder}
              className="w-full pl-10 sm:pl-11 pr-4 py-2.2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 focus:outline-none transition-all"
            />
          </div>

          {/* Email Address Input */}
          <div className="relative">
            <label className="sr-only" htmlFor="email">
              {signupContent.form.emailPlaceholder}
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={signupForm.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder={signupContent.form.emailPlaceholder}
              className="w-full pl-10 sm:pl-11 pr-4 py-2.2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 focus:outline-none transition-all"
            />
          </div>

          {/* Mobile Number Input */}
          <div className="relative">
            <label className="sr-only" htmlFor="mobile">
              {signupContent.form.mobilePlaceholder}
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              id="mobile"
              name="mobile"
              type="tel"
              required
              value={signupForm.mobile}
              onChange={(e) => handleInputChange("mobile", e.target.value)}
              placeholder={signupContent.form.mobilePlaceholder}
              className="w-full pl-10 sm:pl-11 pr-4 py-2.2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 focus:outline-none transition-all"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <label className="sr-only" htmlFor="password">
              {signupContent.form.passwordPlaceholder}
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              value={signupForm.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              placeholder={signupContent.form.passwordPlaceholder}
              className="w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 focus:outline-none transition-all"
            />
            {/* Eye Toggle Icon */}
            <motion.button
              type="button"
              aria-label="Toggle password visibility"
              whileTap={{ scale: 0.85, rotate: 10 }}
              onClick={() => dispatch(toggleShowPassword())}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showPassword ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </motion.button>
          </div>

          {/* Confirm Password Input */}
          <div className="relative">
            <label className="sr-only" htmlFor="confirmPassword">
              {signupContent.form.confirmPasswordPlaceholder}
            </label>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              required
              value={signupForm.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              placeholder={signupContent.form.confirmPasswordPlaceholder}
              className="w-full pl-10 sm:pl-11 pr-10 sm:pr-11 py-2.2 sm:py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 text-sm focus:bg-white focus:border-indigo-600 focus:ring-3 focus:ring-indigo-600/15 focus:outline-none transition-all"
            />
            {/* Eye Toggle Icon */}
            <motion.button
              type="button"
              aria-label="Toggle confirm password visibility"
              whileTap={{ scale: 0.85, rotate: 10 }}
              onClick={() => dispatch(toggleShowConfirmPassword())}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
            >
              {showConfirmPassword ? (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </motion.button>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="flex items-center gap-2 pt-0.5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              required
              checked={signupForm.agreeTerms}
              onChange={(e) => handleInputChange("agreeTerms", e.target.checked)}
              className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500 focus:ring-offset-0 cursor-pointer shrink-0"
            />
            <label htmlFor="terms" className="text-[11px] sm:text-xs text-slate-600 select-none cursor-pointer leading-tight">
              {signupContent.form.termsText}{" "}
              <a href="#" className="font-semibold text-indigo-700 hover:underline">
                {signupContent.form.termsLink}
              </a>{" "}
              {signupContent.form.andText}{" "}
              <a href="#" className="font-semibold text-indigo-700 hover:underline">
                {signupContent.form.privacyLink}
              </a>
            </label>
          </div>

          {/* Primary Create Account Button */}
          <div className="pt-1 sm:pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.015, y: -1 }}
              whileTap={{ scale: 0.985 }}
              className="w-full py-2.5 sm:py-3 px-6 rounded-xl font-medium text-sm text-white bg-linear-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 active:scale-[0.99] transition-all duration-200 shadow-btn-glow flex items-center justify-center gap-2 cursor-pointer group"
            >
              <span>{signupContent.form.submitButtonText}</span>
              <motion.svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                viewBox="0 0 24 24"
              >
                <path d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            </motion.button>
          </div>
        </form>

        {/* Divider & Secondary Sign In Link */}
        <div className="mt-4 sm:mt-5 text-center text-xs text-slate-500">
          <span>{signupContent.form.haveAccountText}</span>
          <Link href="/login" className="font-bold text-indigo-700 hover:text-indigo-800 ml-1 hover:underline">
            {signupContent.form.signinLinkText}
          </Link>
        </div>

        {/* Bottom Officer Advisory Notice Box */}
        <motion.div whileHover={{ scale: 1.01 }} className="mt-4 sm:mt-5 pt-1">
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 sm:p-3 flex items-center gap-2 text-[11px] sm:text-xs text-slate-700">
            <div className="text-indigo-600 shrink-0">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
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
    </section>
  );
}
