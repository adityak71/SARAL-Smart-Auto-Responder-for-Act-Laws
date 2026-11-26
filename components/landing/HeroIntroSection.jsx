"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import PwaInstallButton from "@/components/pwa/PwaInstallButton";
import DayCounter from "@/components/common/DayCounter";

export default function HeroIntroSection() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <section className="ledger-ground relative w-full py-12 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* Left Text & Value Proposition (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            {/* Bold Headline */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="space-y-2"
            >
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-slate-900 dark:text-white tracking-tight leading-[1.15]">
                File your RTI application online
                <span className="block text-purple-600 dark:text-purple-300">
                  Track it until you get a reply
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
              <strong>SARAL (Smart Auto-Responder for Act Laws)</strong> ek citizen portal hai jo aam nagrikon ko bina kisi vakeel ya kanooni jhanjhat ke government departments se information maangne, RTI track karne aur official certified response lene me madad karta hai.
            </motion.p>

            {/* CTA Button Group with PWA Install Now Action */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-4 w-full pt-2"
            >
              {isAuthenticated ? (
                <>
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm sm:text-base active:scale-[0.98] transition-colors group cursor-pointer"
                  >
                    <span>Go to My Dashboard</span>
                    <svg
                      className="w-4.5 h-4.5 stroke-[2.2] transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.5 4.5L21 12m0 0-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  <Link
                    href="/file-rti"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-purple-100 hover:bg-purple-200/80 dark:bg-white/10 dark:hover:bg-white/15 text-purple-900 dark:text-purple-200 border border-purple-300/80 dark:border-white/15 font-semibold text-sm sm:text-base shadow-sm active:scale-[0.98] transition-colors cursor-pointer"
                  >
                    <span>+ File New RTI</span>
                  </Link>

                  <Link
                    href="/tracking"
                    className="inline-flex items-center justify-center gap-2 px-2 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:text-purple-700 dark:hover:text-purple-300 hover:bg-slate-900/5 dark:hover:bg-white/5 font-medium text-sm transition-colors cursor-pointer"
                  >
                    <svg className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Track Status</span>
                  </Link>

                  {/* PWA Install Button */}
                  <PwaInstallButton />
                </>
              ) : (
                <>
                  <Link
                    href="/login?redirect=/file-rti"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm sm:text-base active:scale-[0.98] transition-colors group cursor-pointer"
                  >
                    <span>File an RTI Application</span>
                    <svg
                      className="w-4.5 h-4.5 stroke-[2.2] transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M13.5 4.5L21 12m0 0-7.5 7.5M21 12H3" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </Link>

                  <Link
                    href="/tracking"
                    className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-slate-100 hover:bg-slate-200/80 dark:bg-white/10 dark:hover:bg-white/15 text-slate-800 dark:text-slate-200 border border-slate-300/80 dark:border-white/15 font-semibold text-sm sm:text-base shadow-sm active:scale-[0.98] transition-colors cursor-pointer"
                  >
                    <svg className="w-4.5 h-4.5 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <span>Track Existing RTI</span>
                  </Link>

                  {/* PWA Install Button */}
                  <PwaInstallButton />
                </>
              )}
            </motion.div>

            {/* Key facts, one quiet line */}
            <p className="pt-2 text-sm text-slate-600 dark:text-slate-400">
              ₹10 treasury fee · Reply due in 30 days · DigiLocker verified · Android, iOS, Windows and macOS
            </p>
          </div>

          {/* Right: a sample of what SARAL produces, a drafted Section 6(1) application (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <figure className="relative w-full max-w-md rounded-3xl overflow-hidden border border-slate-300 dark:border-white/15 shadow-xl bg-white dark:bg-[#1d2733] text-slate-800 dark:text-slate-200">
              <div className="px-6 pt-6 pb-5 space-y-4 text-sm leading-relaxed">
                <div className="flex items-start justify-between gap-4">
                  <p className="font-semibold text-slate-900 dark:text-white">
                    Application under Section 6(1), RTI Act 2005
                  </p>
                  <span className="shrink-0 font-mono text-xs text-slate-500 dark:text-slate-400">SARAL-2026-00124</span>
                </div>

                <div className="space-y-0.5">
                  <p className="text-slate-500 dark:text-slate-400">To</p>
                  <p>The Public Information Officer</p>
                  <p>Public Works Department, Hoshangabad (M.P.)</p>
                </div>

                <p>
                  <span className="text-slate-500 dark:text-slate-400">Subject: </span>
                  Information on the road from Pipariya to the district highway
                </p>

                <ol className="list-decimal pl-5 space-y-1">
                  <li>Certified copy of the sanction order and approved budget</li>
                  <li>Name of the contractor and the work order</li>
                  <li>Amount paid to date, with measurement book entries</li>
                </ol>

                <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-dashed border-slate-300 dark:border-white/15">
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium">Fee ₹10 paid</span>
                  <DayCounter current={18} total={30} className="w-44" />
                </div>
              </div>

              <figcaption className="px-6 py-3 bg-purple-700 text-white">
                <span className="text-xs font-semibold text-purple-100 block">
                  Write in plain Hindi or English
                </span>
                <p className="text-sm font-semibold">
                  SARAL drafts it as a Section 6(1) application
                </p>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}