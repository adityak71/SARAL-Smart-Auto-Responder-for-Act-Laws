"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  ArrowRight as IcArrowRight,
  BadgeCheck as IcBadgeCheck,
  CircleCheck as IcCircleCheck,
  Clock as IcClock,
  Eye as IcEye,
  Hourglass as IcHourglass,
  NotebookPen as IcNotebookPen,
  Plus as IcPlus,
  ShieldCheck as IcShieldCheck,
} from "lucide-react";
import PwaInstallButton from "@/components/pwa/PwaInstallButton";
import DayCounter from "@/components/common/DayCounter";

// Stitch screen 1 "Home & RTI Drafting Hero": serif headline on the dotted ground,
// one dark primary action, quieter secondary actions, statutory chips and a gazette-format sample.
const BTN_PRIMARY =
  "inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-lg bg-purple-900 hover:bg-purple-700 text-white dark:bg-white dark:text-purple-900 dark:hover:bg-slate-100 font-semibold text-base shadow-sm transition-colors group cursor-pointer";
const BTN_SECONDARY =
  "inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-purple-900 dark:text-purple-100 font-semibold text-base shadow-sm transition-colors cursor-pointer";

const CHIP = "label-caps inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-sm border";

export default function HeroIntroSection() {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return (
    <section className="ledger-ground relative w-full py-12 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-center">
          {/* Left Text & Value Proposition (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="space-y-5"
            >
              <div className="flex flex-wrap items-center gap-3">
                <span className={`${CHIP} bg-cyan-100 border-cyan-200 text-cyan-700 dark:bg-cyan-500/10 dark:border-cyan-500/30 dark:text-cyan-300`}>
                  <IcBadgeCheck className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                  RTI Act 2005
                </span>
                <span className="text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                  सत्यमेव जयते • सूचना का अधिकार अब हर भारतीय नागरिक की पहुँच में
                </span>
              </div>
              <h1 className="text-[32px] leading-10 sm:text-[44px] sm:leading-[54px] lg:text-5xl lg:leading-[1.12] font-semibold text-purple-900 dark:text-white tracking-[-0.02em]">
                File your RTI application online
                <span className="block font-normal italic text-purple-500 dark:text-purple-300">
                  Track it until you get a reply
                </span>
              </h1>
            </motion.div>

            {/* Clear, Engaging Explanation */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.16 }}
              className="text-[17px] leading-7 text-slate-600 dark:text-slate-300 max-w-2xl"
            >
              <strong className="font-semibold text-slate-900 dark:text-white">SARAL</strong> (Smart Auto-Responder for Act Laws) ek citizen portal hai jo aam nagrikon ko bina kisi vakeel ya kanooni jhanjhat ke government departments se information maangne, RTI track karne aur official certified response lene me madad karta hai.
            </motion.p>

            {/* CTA Button Group with PWA Install Now Action */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.22 }}
              className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full pt-1"
            >
              {isAuthenticated ? (
                <>
                  <Link href="/dashboard" className={BTN_PRIMARY}>
                    <span>Go to My Dashboard</span>
                    <IcArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
                  </Link>
                  <Link href="/file-rti" className={BTN_SECONDARY}>
                    <IcPlus className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
                    <span>File New RTI</span>
                  </Link>
                  <Link href="/tracking" className={BTN_SECONDARY}>
                    <IcEye className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
                    <span>Track Status</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login?redirect=/file-rti" className={BTN_PRIMARY}>
                    <span>File an RTI Application</span>
                    <IcArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden="true" />
                  </Link>
                  <Link href="/tracking" className={BTN_SECONDARY}>
                    <IcEye className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
                    <span>Track Existing RTI</span>
                  </Link>
                </>
              )}
            </motion.div>

            {/* Install row */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
              <PwaInstallButton />
              <span>Compatible on Android • iOS • Windows • macOS</span>
            </div>

            {/* Statutory facts as chips */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className={`${CHIP} bg-[#eaefea] border-[#c2d6c5] text-[#2a473e] dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300`}>
                <IcCircleCheck className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                ₹10 standard treasury fee
              </span>
              <span className={`${CHIP} bg-[#ebeff0] border-[#cbd7da] text-purple-600 dark:bg-white/5 dark:border-white/15 dark:text-purple-200`}>
                <IcClock className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                30-day response clock
              </span>
              <span className={`${CHIP} bg-cyan-100 border-cyan-200 text-cyan-700 dark:bg-cyan-500/10 dark:border-cyan-500/30 dark:text-cyan-300`}>
                <IcShieldCheck className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                DigiLocker verified
              </span>
            </div>
          </div>

          {/* Right: a sample of what SARAL produces, a drafted Section 6(1) application (5 Cols) */}
          <div className="lg:col-span-5 relative flex justify-center">
            <figure className="relative w-full max-w-md rounded-xl overflow-hidden border border-slate-300/60 dark:border-white/15 shadow-xl bg-white dark:bg-[#1c2e36] text-slate-800 dark:text-slate-200">
              <div className="h-1 bg-gradient-to-r from-purple-900 via-purple-500 to-cyan-600" aria-hidden="true" />
              <div className="px-6 pt-6 pb-5 space-y-5 text-sm leading-relaxed">
                <div className="flex items-start justify-between gap-4 pb-5 border-b border-slate-200 dark:border-white/10">
                  <div className="space-y-1">
                    <p className="label-caps text-cyan-700 dark:text-cyan-300">Official gazette format</p>
                    <p className="font-display text-xl leading-7 font-semibold text-purple-900 dark:text-white">
                      Application under Section 6(1), RTI Act 2005
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-[11px] tracking-wider px-2 py-1 rounded-sm bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-slate-300">
                    SARAL-2026-00124
                  </span>
                </div>

                <div className="p-4 rounded-md bg-[#eaf5fd] dark:bg-white/5 space-y-1">
                  <p className="label-caps text-slate-500 dark:text-slate-300">To PIO / Designated officer</p>
                  <p className="font-semibold text-slate-900 dark:text-white">The Public Information Officer</p>
                  <p className="text-slate-600 dark:text-slate-300">Public Works Department, Hoshangabad (M.P.)</p>
                </div>

                <div className="space-y-1">
                  <p className="label-caps text-slate-500 dark:text-slate-400">Subject matter</p>
                  <p className="text-slate-700 dark:text-slate-200">Information on the road from Pipariya to the district highway</p>
                </div>

                <div className="space-y-2">
                  <p className="label-caps text-slate-500 dark:text-slate-400">Information sought</p>
                  <ol className="space-y-2">
                    {[
                      "Certified copy of the sanction order and approved budget",
                      "Name of the contractor and the work order",
                      "Amount paid to date, with measurement book entries",
                    ].map((item, i) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-slate-100 dark:bg-white/10 text-[11px] font-semibold text-purple-900 dark:text-purple-100 flex items-center justify-center">
                          {i + 1}
                        </span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex flex-wrap items-end justify-between gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  <span className={`${CHIP} bg-[#eaefea] border-[#c2d6c5] text-[#2a473e] dark:bg-emerald-500/10 dark:border-emerald-500/30 dark:text-emerald-300`}>
                    <IcCircleCheck className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
                    Fee ₹10 paid
                  </span>
                  <div className="flex items-end gap-2">
                    <IcHourglass className="w-4 h-4 mb-2 text-cyan-600" strokeWidth={1.75} aria-hidden="true" />
                    <DayCounter current={18} total={30} className="w-44" />
                  </div>
                </div>
              </div>

              <figcaption className="px-6 py-4 bg-purple-600 text-white flex items-center gap-4">
                <span className="shrink-0 w-10 h-10 rounded-sm bg-purple-900 flex items-center justify-center">
                  <IcNotebookPen className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
                </span>
                <span>
                  <span className="text-sm font-semibold block">Write in plain Hindi or English</span>
                  <span className="text-sm text-purple-300 block">SARAL drafts it as a Section 6(1) application</span>
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
