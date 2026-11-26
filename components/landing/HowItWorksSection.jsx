"use client";

import { motion } from "framer-motion";
import { howItWorksSteps } from "@/data/howItWorksData";
import { Shield as IcShield, Zap as IcZap } from "lucide-react";

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="w-full py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold tracking-wider mb-2">
              <span>The 4-Step Citizen Flow</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Simple Steps, Sovereign Results
            </h2>
            <p className="text-xs sm:text-sm text-purple-700/80 dark:text-purple-200/80 mt-1">
              नागरिक की अपनी भाषा से कानूनी रूप से वैध आरटीआई जवाब तक
            </p>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed">
            SARAL handles statutory legal formatting, jurisdictional routing, and fee execution so you never deal with bureaucratic red tape or technical rejection.
          </p>
        </div>

        {/* 4 Cards Vertical Progression */}
        <div className="space-y-8">
          {howItWorksSteps.map((step, idx) => (
            <motion.div
              key={step.stepNumber}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="rounded-3xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-6 sm:p-8 relative overflow-hidden shadow-xl"
            >

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Description (5 Cols) */}
                <div className="lg:col-span-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-8 h-8 rounded-xl bg-purple-600 text-white font-extrabold text-sm flex items-center justify-center shadow-md">
                      {step.stepNumber}
                    </span>
                    <span className="text-xs font-bold text-purple-700 dark:text-purple-300 tracking-wider">
                      {step.tag}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-snug">
                    {step.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {step.description}
                  </p>

                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-lg bg-purple-50 dark:bg-white/5 border border-purple-200 dark:border-white/10 text-cyan-700 dark:text-cyan-300 text-xs font-semibold w-fit">
                    <span className="text-xs"><IcZap className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                    <span>{step.badge}</span>
                  </div>
                </div>

                {/* Right Visual Terminal / Mockup (7 Cols) */}
                <div className="lg:col-span-7 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200 dark:border-purple-500/20 p-4 sm:p-6 shadow-inner flex flex-col gap-3 text-slate-700 dark:text-slate-200">
                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-white/10 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="font-mono text-slate-900 dark:text-white text-xs font-semibold">
                        {step.mockup.header}
                      </span>
                    </div>
                    {step.mockup.detectedLanguage && (
                      <span className="px-2 py-0.5 rounded-lg bg-purple-500/15 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300 text-xs font-bold">
                        {step.mockup.detectedLanguage}
                      </span>
                    )}
                  </div>

                  {/* Step-specific content */}
                  {step.mockup.type === "input" && (
                    <div className="space-y-2.5 text-xs">
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/5">
                        <span className="text-xs text-slate-500 dark:text-slate-400 font-bold block mb-1">
                          Raw Citizen Input:
                        </span>
                        <p className="italic text-slate-800 dark:text-slate-200">{step.mockup.citizenQuote}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/30 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-700 dark:text-purple-200 text-xs">
                            {step.mockup.copilotLabel}
                          </span>
                          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                            Parsed into 4 Scope Nodes
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1 text-xs text-slate-700 dark:text-slate-300">
                          {step.mockup.scopeNodes.map((node, i) => (
                            <div key={i} className="p-1.5 rounded bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5">
                              ✓ {node}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step.mockup.type === "legal" && (
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04]">
                        <span className="text-slate-500 dark:text-slate-400">Jurisdictional Route:</span>
                        <strong className="text-purple-700 dark:text-purple-300">{step.mockup.ministry}</strong>
                      </div>
                      <div className="flex justify-between items-center p-2.5 rounded-xl bg-slate-100 dark:bg-white/[0.04]">
                        <span className="text-slate-500 dark:text-slate-400">Confidence Metric:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{step.mockup.classificationScore}</strong>
                      </div>
                      <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-500/20 space-y-1">
                        <span className="text-purple-800 dark:text-purple-200 font-bold block text-xs">
                          Auto-Framed Section 6(1) Clauses:
                        </span>
                        {step.mockup.statutoryClauses.map((clause, i) => (
                          <div key={i} className="text-slate-700 dark:text-slate-300 text-xs leading-snug">
                            • {clause}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {step.mockup.type === "officer" && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] space-y-1">
                        <span className="text-slate-500 dark:text-slate-400 text-xs block">Public Information Officer:</span>
                        <strong className="text-slate-900 dark:text-white text-sm block">{step.mockup.officer}</strong>
                        <span className="text-emerald-600 dark:text-emerald-400 text-xs block">{step.mockup.verifiedRecords}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold flex items-center gap-2">
                        <span><IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                        <span>{step.mockup.actionStatus}</span>
                      </div>
                    </div>
                  )}

                  {step.mockup.type === "delivery" && (
                    <div className="space-y-2 text-xs">
                      <div className="p-3 rounded-xl bg-slate-100 dark:bg-white/[0.04] flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">{step.mockup.turnaround}</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold">100% Compliant</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs">
                        ✓ {step.mockup.dispatchDelivery}
                      </div>
                      <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs">
                        <IcZap className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> {step.mockup.appealProtection}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
