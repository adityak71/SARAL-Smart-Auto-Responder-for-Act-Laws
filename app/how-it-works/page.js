"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { howItWorksSteps } from "@/data/howItWorksData";
import { Zap as IcZap } from "lucide-react";

export default function HowItWorksPage() {
  const statutoryClockStages = [
    {
      day: "Day 01",
      title: "Petition Lodged & Fee Settled",
      desc: "Citizen submits raw inquiry in Hindi, English, or vernacular speech. Section 6(1) petition formatted and ₹10 statutory fee recorded.",
      badge: "Clock Starts",
      color: "purple",
    },
    {
      day: "Day 05",
      title: "Section 6(3) Transfer Check",
      desc: "If information falls under another ministry, PIO is mandated by law to transfer it within 5 days with notice to the citizen.",
      badge: "Jurisdiction Check",
      color: "indigo",
    },
    {
      day: "Day 18–25",
      title: "PIO Record Retrieval & Scrutiny",
      desc: "Designated Public Information Officer retrieves certified government files, tenders, or accounts and reviews draft response.",
      badge: "Officer Verification",
      color: "cyan",
    },
    {
      day: "Day 30",
      title: "Certified Digital Delivery",
      desc: "Official certified PDF with digital signature delivered to Citizen Portal and DigiLocker. 100% compliant with RTI Act Section 7(1).",
      badge: "Statutory Deadline",
      color: "emerald",
    },
    {
      day: "Day 31+",
      title: "Section 19(1) First Appeal Shield",
      desc: "If no response or unsatisfactory data is given, SARAL automatically generates the First Appeal petition addressed to the First Appellate Authority.",
      badge: "Citizen Protection",
      color: "amber",
    },
  ];

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#121821] text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
        
        {/* Page Hero Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            How SARAL works <br />
            <span className="text-purple-600 dark:text-purple-300">
              From your question to an official reply
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
          >
            नागरिक की आम बोलचाल से लेकर कानूनी रूप से प्रमाणित सरकारी जवाब तक — SARAL red tape, technical reject, aur legal jargons ko poori tarah khatam karta hai.
          </motion.p>
        </section>

        {/* 4 Cards Progression */}
        <section className="space-y-8" data-purpose="citizen-flow-steps">
          {howItWorksSteps.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: idx * 0.1 }}
              className="rounded-3xl bg-white dark:bg-[#1a2330] border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-sm transition-colors"
            >

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Description (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                      {step.stepNumber}
                    </span>
                    <span className="text-xs font-bold text-purple-600 dark:text-purple-300 tracking-wider">
                      {step.tag}
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {step.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="inline-flex items-center gap-2 mt-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-cyan-700 dark:text-cyan-300 text-xs font-semibold w-fit">
                    <span><IcZap className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                    <span>{step.badge}</span>
                  </div>
                </div>

                {/* Right Visual Terminal / Mockup (7 Cols) */}
                <div className="lg:col-span-7 rounded-2xl bg-slate-900 text-slate-100 dark:bg-[#121821] border border-slate-800 dark:border-purple-500/20 p-5 sm:p-6 shadow-xl flex flex-col gap-4 font-sans">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      <span className="font-mono text-white text-xs font-semibold">
                        {step.mockup.header}
                      </span>
                    </div>
                    {step.mockup.detectedLanguage && (
                      <span className="px-2 py-0.5 rounded-lg bg-purple-500/20 text-purple-300 text-xs font-bold">
                        {step.mockup.detectedLanguage}
                      </span>
                    )}
                  </div>

                  {/* Step-specific Terminal Content */}
                  {step.mockup.type === "input" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5">
                        <span className="text-xs text-slate-400 font-bold block mb-1">
                          Raw Citizen Input (Voice or Typing):
                        </span>
                        <p className="text-purple-100">{step.mockup.citizenQuote}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-200 text-xs">
                            {step.mockup.copilotLabel}
                          </span>
                          <span className="text-xs text-emerald-400 font-semibold">
                            ✦ 4 Scopes Identified
                          </span>
                        </div>
                        <ul className="space-y-1 text-xs text-slate-300">
                          {step.mockup.scopeNodes.map((node, i) => (
                            <li key={i} className="flex items-center gap-2">
                              <span className="text-purple-400">▹</span>
                              <span>{node}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  {step.mockup.type === "legal" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-cyan-300 text-xs">
                            Competent Authority:
                          </span>
                          <span className="text-xs text-emerald-400 font-mono">
                            {step.mockup.classificationScore}
                          </span>
                        </div>
                        <p className="font-medium text-white">{step.mockup.ministry}</p>
                        <p className="text-xs text-slate-400">{step.mockup.exemptionsCheck}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-950/40 border border-purple-500/30 space-y-1">
                        <span className="font-bold text-purple-200 text-xs block mb-1">
                          Drafted Section 6(1) Inquiries:
                        </span>
                        {step.mockup.statutoryClauses.map((clause, i) => (
                          <p key={i} className="text-xs text-slate-300">
                            • {clause}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.mockup.type === "officer" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                        <span className="text-xs text-slate-400 font-bold block">
                          Assigned Public Information Officer:
                        </span>
                        <p className="font-bold text-white text-sm">{step.mockup.officer}</p>
                        <p className="text-xs text-cyan-300">{step.mockup.verifiedRecords}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                        <span className="text-emerald-300 text-xs font-semibold">
                          {step.mockup.actionStatus}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-xs font-bold">
                          ✓ Signed
                        </span>
                      </div>
                    </div>
                  )}

                  {step.mockup.type === "delivery" && (
                    <div className="space-y-3 text-xs">
                      <div className="p-3 rounded-xl bg-white/[0.04] border border-white/5 space-y-1">
                        <span className="text-emerald-400 font-bold block">
                          {step.mockup.turnaround}
                        </span>
                        <p className="text-xs text-slate-300">{step.mockup.dispatchDelivery}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-indigo-950/40 border border-indigo-500/30">
                        <span className="text-indigo-300 text-xs font-semibold block">
                          {step.mockup.appealProtection}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </section>

        {/* 30-Day Statutory Clock Lifecycle Section */}
        <section className="rounded-3xl bg-white dark:bg-[#1a2330] border border-slate-200/90 dark:border-white/10 p-6 sm:p-8 lg:p-10 shadow-sm dark:shadow-xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Statutory Transparency Protection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              The 30-Day Statutory Timer Shield
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Section 7(1) of the RTI Act binds officers to supply information within 30 calendar days (or 48 hours in matters of life or liberty).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {statutoryClockStages.map((stage, idx) => (
              <div
                key={stage.day}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 flex flex-col justify-between space-y-3 hover:border-purple-400/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-extrabold text-purple-600 dark:text-purple-300 font-mono">
                      {stage.day}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-semibold bg-purple-500/10 text-purple-700 dark:text-purple-300">
                      {stage.badge}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white leading-snug">
                    {stage.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-white/5 text-xs text-slate-400 font-mono">
                  Stage {idx + 1} of 5
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="rounded-3xl bg-purple-900 p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden shadow-2xl">
          
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Access Public Information?
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              No legal background needed. Start your petition in Hindi or English, and let SARAL handle the rest.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <Link
              href="/login"
              className="px-6 py-4 rounded-xl font-bold text-sm bg-white text-purple-950 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-colors"
            >
              File an RTI Petition →
            </Link>
            <Link
              href="/tracking"
              className="px-6 py-4 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-colors"
            >
              Track Existing Application
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
