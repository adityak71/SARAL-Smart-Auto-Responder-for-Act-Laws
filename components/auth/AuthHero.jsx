"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Emblem from "@/components/common/Emblem";
import { portalConfig } from "@/data/portalConfig";
import { loginContent, signupContent, authFeatures } from "@/data/authContent";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemFadeUp = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const itemFadeLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function AuthHero({ type = "login" }) {
  const isLogin = type === "login";
  const content = isLogin ? loginContent.hero : signupContent.hero;

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative w-full lg:w-[54%] xl:w-[53%] flex flex-col justify-between px-5 pt-6 pb-2 sm:px-8 sm:pt-8 lg:p-14 xl:p-16 overflow-hidden lg:min-h-screen z-10"
      data-purpose="hero-showcase"
    >
      {/* Top Header & Badge Row */}
      <motion.div variants={itemFadeUp} className="flex items-center justify-between gap-3 w-full mb-3 lg:mb-0">
        {/* Emblem & Portal Brand */}
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Emblem className="w-9 h-11 sm:w-11 sm:h-13 lg:w-12 lg:h-14 transition-transform" />
          </motion.div>
          <div className="leading-tight text-left">
            <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-bold tracking-tight text-white font-sans">
              {portalConfig.name}
            </h1>
            <p className="text-[11px] sm:text-[13px] text-white/75 font-medium tracking-wide">
              {portalConfig.shortDescription}
            </p>
          </div>
        </Link>

        {/* Feature Pill Badge */}
        {isLogin ? (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-purple-200 bg-purple-950/60 border border-purple-500/40 shadow-[0_0_15px_rgba(168,85,247,0.25)] backdrop-blur-md cursor-default shrink-0"
          >
            <motion.svg
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-300 fill-current"
              viewBox="0 0 24 24"
            >
              <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
            </motion.svg>
            <span>{content.badgeText}</span>
          </motion.div>
        ) : (
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="glass-pill px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full flex items-center gap-1.5 shadow-sm text-[11px] sm:text-xs font-semibold text-white tracking-wide cursor-default shrink-0"
          >
            <svg
              className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{content.badgeText}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Main Central Headline and Glass Showcase */}
      <div className="my-2 sm:my-4 lg:my-auto flex flex-col justify-center max-w-142.5 text-left">
        {/* Headline */}
        <motion.div variants={itemFadeLeft} className="space-y-0.5 sm:space-y-1 mb-2 sm:mb-4">
          <h2 className="text-2xl sm:text-4xl lg:text-[52px] font-extrabold tracking-tight text-white leading-tight lg:leading-[1.12]">
            {content.headline}
          </h2>
          <div
            className={`text-2xl sm:text-4xl lg:text-[52px] font-extrabold tracking-tight leading-tight lg:leading-[1.12] ${
              isLogin
                ? "text-purple-300 lg:text-[#ba99ff]"
                : "text-transparent bg-clip-text bg-linear-to-r from-purple-200 via-white to-purple-300 lg:from-white lg:via-slate-100 lg:to-indigo-200"
            }`}
          >
            {content.highlight}
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          variants={itemFadeLeft}
          className="text-xs sm:text-[15px] lg:text-[16px] text-purple-200/80 lg:text-slate-300 font-normal leading-relaxed mb-4 lg:mb-8 max-w-122.5"
        >
          {isLogin
            ? "Submit RTI applications, track progress & receive official updates."
            : content.description}
        </motion.p>

        {/* Desktop-Only Glass Showcase: Status Tracker Card (Login) OR 3D Document Illustration (Signup) */}
        {isLogin ? (
          <motion.div
            variants={itemFadeUp}
            whileHover={{ y: -3, borderColor: "rgba(255, 255, 255, 0.3)" }}
            transition={{ duration: 0.3 }}
            className="hidden lg:block glass-card rounded-2xl p-5 sm:p-6 w-full max-w-130"
            data-purpose="status-tracker-card"
          >
            {/* Card Header Info */}
            <div className="flex items-center justify-between mb-5 pb-2">
              <div className="flex items-center gap-3.5">
                <motion.div
                  whileHover={{ rotate: 10, scale: 1.08 }}
                  className="w-11 h-11 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-200"
                >
                  <svg className="w-6 h-6 stroke-current" fill="none" strokeWidth="1.8" viewBox="0 0 24 24">
                    <path
                      d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </motion.div>
                <div>
                  <h3 className="text-white text-sm sm:text-base font-semibold tracking-tight">
                    {loginContent.hero.trackerCard.title}
                  </h3>
                  <p className="text-xs text-purple-200/80 font-mono tracking-wide">
                    {loginContent.hero.trackerCard.trackingId}
                  </p>
                </div>
              </div>

              {/* Status Tag */}
              <motion.span
                animate={{
                  boxShadow: [
                    "0 0 10px rgba(245,158,11,0.2)",
                    "0 0 18px rgba(245,158,11,0.45)",
                    "0 0 10px rgba(245,158,11,0.2)",
                  ],
                }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium text-amber-300 bg-amber-500/15 border border-amber-500/30"
              >
                {loginContent.hero.trackerCard.statusBadge}
              </motion.span>
            </div>

            {/* Progress Stepper */}
            <div className="relative pt-2 pb-1 px-3">
              {/* Connecting Line Background */}
              <div className="absolute top-4.25 left-9 right-9 h-0.5 bg-slate-700/80 z-0" />
              {/* Active Animated Fill Line */}
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "48%" }}
                transition={{ duration: 1.4, delay: 0.35, ease: "easeInOut" }}
                className="absolute top-4.25 left-9 h-0.5 bg-linear-to-r from-emerald-400 via-purple-400 to-purple-500 z-0"
              />

              {/* Stepper Nodes */}
              <div className="relative z-10 flex justify-between items-start text-center">
                {/* Step 1: Submitted */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/40">
                    <svg className="w-4 h-4 stroke-white stroke-[2.5]" fill="none" viewBox="0 0 24 24">
                      <path d="m4.5 12.75 6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-xs font-medium text-slate-200 mt-2">Submitted</span>
                </motion.div>

                {/* Step 2: Under Review */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-7 h-7 rounded-full bg-indigo-900 border-2 border-purple-400 flex items-center justify-center shadow-[0_0_14px_rgba(168,85,247,0.85)] relative">
                    <motion.div
                      animate={{ scale: [1, 1.35, 1], opacity: [0.8, 0.3, 0.8] }}
                      transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                      className="absolute inset-0 rounded-full border border-purple-400/80"
                    />
                    <div className="w-2.5 h-2.5 rounded-full bg-white ring-4 ring-purple-500/50" />
                  </div>
                  <span className="text-xs font-semibold text-white mt-2">Under Review</span>
                </motion.div>

                {/* Step 3: Response */}
                <motion.div
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-7 h-7 rounded-full bg-slate-800/90 border border-slate-600/60 flex items-center justify-center text-slate-400">
                    <div className="w-2 h-2 rounded-full bg-slate-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-400 mt-2">Response</span>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Desktop-Only Signup 3D Graphic Showcase */
          <motion.div
            variants={itemFadeUp}
            className="hidden lg:flex relative py-4 my-2 items-center justify-center"
            data-purpose="rti-glass-graphic"
          >
            {/* Pulsing Glow Halo Ring */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.35, 0.55, 0.35] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
              className="absolute w-64 h-64 sm:w-80 sm:h-80 halo-orbit rounded-full blur-2xl pointer-events-none z-0"
            />
            {/* Rotating Orbit Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
              className="absolute w-64 h-36 border border-purple-400/20 rounded-[100%] rotate-[-22deg] blur-[0.5px]"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 50, ease: "linear" }}
              className="absolute w-72 h-40 border border-indigo-400/30 rounded-[100%] rotate-[-15deg]"
            />

            {/* Glass RTI Document Card */}
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [-2, -0.5, -2] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              whileHover={{ rotate: 0, scale: 1.03 }}
              className="relative z-10 glass-doc w-60 sm:w-68 p-5 sm:p-6 rounded-2xl shadow-2xl cursor-pointer"
            >
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-indigo-300/20">
                <span className="text-lg font-bold text-white tracking-wide">RTI</span>
                <div className="w-12 h-1.5 bg-indigo-300/40 rounded-full" />
              </div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 my-2.5"
              >
                <div className="w-5 h-5 rounded-md bg-indigo-500/80 flex items-center justify-center text-white shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="h-2 w-28 bg-indigo-200/50 rounded-full" />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center gap-3 my-2.5"
              >
                <div className="w-5 h-5 rounded-md bg-indigo-500/80 flex items-center justify-center text-white shadow-sm">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path d="M4.5 12.75l6 6 9-13.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="h-2 w-20 bg-indigo-200/40 rounded-full" />
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.12, rotate: 12 }}
                className="absolute -bottom-4 -right-4 shield-badge w-14 h-16 rounded-xl flex items-center justify-center text-white shadow-xl border border-white/30 transform rotate-6"
              >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.765z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </div>

      {/* Desktop-Only Bottom Feature Badges Bar */}
      <motion.footer variants={itemFadeUp} className="hidden lg:flex pt-4 flex-wrap items-center gap-5 sm:gap-8">
        {authFeatures.map((feat) => (
          <motion.div
            key={feat.id}
            whileHover={{ y: -4, scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex items-center gap-3 cursor-default"
          >
            <div className="w-10 h-10 rounded-xl glass-chip flex items-center justify-center text-purple-300 shadow-sm shrink-0 transition-colors hover:border-purple-400/40">
              {feat.icon === "document" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
              {feat.icon === "clock" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
              {feat.icon === "chat" && (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                  <path
                    d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a.75.75 0 0 1-.974-.94 4.542 4.542 0 0 0 .57-2.029C3.415 16.326 3 14.28 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
            <div className="text-xs font-medium leading-snug">
              <span className="block text-slate-200">{feat.title}</span>
              <span className="text-slate-400">{feat.subtitle}</span>
            </div>
          </motion.div>
        ))}
      </motion.footer>
    </motion.section>
  );
}
