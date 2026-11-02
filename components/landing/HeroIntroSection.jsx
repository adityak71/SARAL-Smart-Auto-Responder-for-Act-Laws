"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function HeroIntroSection() {
  return (
    <section className="relative w-full py-12 lg:py-20 overflow-hidden">
      {/* Ambient Radial Lights */}
      <div className="absolute -top-24 right-[-10%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(147,51,234,0.18),transparent_65%)] blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -left-36 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(6,182,212,0.15),transparent_65%)] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* Left Text & Value Proposition (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold tracking-wider uppercase shadow-sm"
            >
              <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
              <span>AI-POWERED RIGHT TO INFORMATION • RTI ACT 2005</span>
            </motion.div>

            {/* Bold Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="space-y-2"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.12]">
                Your Right to Know.
                <span className="block bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                  Made Simpler.
                </span>
              </h1>
              <p className="text-sm sm:text-base font-semibold text-purple-700 dark:text-purple-300 pt-1">
                सत्यमेव जयते • सूचना का अधिकार अब हर भारतीय नागरिक की पहुँच में
              </p>
            </motion.div>

            {/* Clear, Engaging Explanation */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed"
            >
              <strong>SARAL (Smart Auto-Responder for Act Laws)</strong> ek AI-powered citizen portal hai jo aam nagrikon ko bina kisi vakeel ya kanooni jhanjhat ke government departments se information maangne, RTI track karne aur official certified response lene me madad karta hai.
            </motion.p>

            {/* CTA Button Group */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto pt-2"
            >
              <Link
                href="/login"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white font-semibold text-sm sm:text-base shadow-[0_8px_25px_-4px_rgba(99,102,241,0.5)] active:scale-[0.98] transition-all group cursor-pointer"
              >
                <span>File an RTI Application</span>
                <svg
                  className="w-4.5 h-4.5 stroke-[2.2] transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Link>

              <Link
                href="/tracking"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-300/80 dark:border-white/15 font-semibold text-sm sm:text-base shadow-sm active:scale-[0.98] transition-all cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>Track Existing RTI</span>
              </Link>
            </motion.div>

            {/* Trust Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 font-semibold">
                ✓ ₹10 Standard Treasury Fee
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-500/20 font-semibold">
                ✓ 30-Day Mandatory Response Clock
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/20 font-semibold">
                ✓ DigiLocker Verified
              </span>
            </div>
          </div>

          {/* Right Presentation Hero Artwork (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            {/* Glowing Accent Ring */}
            <div className="absolute -inset-2 rounded-3xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 blur-xl opacity-40 dark:opacity-50 animate-pulse pointer-events-none" />

            <motion.div
              whileHover={{ scale: 1.02, y: -4 }}
              transition={{ duration: 0.3 }}
              className="relative w-full max-w-md rounded-3xl overflow-hidden border border-slate-200 dark:border-white/20 shadow-2xl bg-white dark:bg-[#120835]"
            >
              <img
                src="/images/saral-hero-citizen.png"
                alt="Empowered Indian citizen with digital RTI tablet"
                className="w-full h-auto object-cover max-h-[460px]"
              />

              {/* Floating Overlay Badge on Image */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-2xl bg-slate-900/80 dark:bg-[#0c0529]/90 backdrop-blur-md border border-white/20 text-white shadow-lg flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-purple-300 uppercase block tracking-wider">
                    Democratizing RTI with AI
                  </span>
                  <p className="text-xs font-semibold text-slate-100">
                    Voice & Plain Hindi to Legal Section 6(1) Petition
                  </p>
                </div>
                <span className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                  ⚡
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
