"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Brain as IcBrain, ShieldCheck as IcShieldCheck, Lock as IcLock } from "lucide-react";
import { citizenStories } from "@/data/citizenStoriesData";

export default function AboutPage() {
  const comparison = [
    {
      feature: "Filing Difficulty",
      traditional: "Must draft complex legal terminology in English/State format",
      saral: "Speak or type naturally in Hindi, Hinglish, or vernacular language",
    },
    {
      feature: "Jurisdiction & Department",
      traditional: "Citizen often guesses wrong ministry resulting in rejection",
      saral: "AI identifies exact competent Public Authority & PIO automatically",
    },
    {
      feature: "Statutory Deadline",
      traditional: "Manual post tracking; no alerts when 30 days are violated",
      saral: "Real-time 30-day statutory clock with auto-generated First Appeals",
    },
    {
      feature: "Record Access",
      traditional: "Physical visits, postal orders, certified photocopy delays",
      saral: "Digital certified PDF docket delivered straight to citizen portal",
    },
    {
      feature: "Fee Settlement",
      traditional: "Indian Postal Order (IPO) or treasury challan purchase queues",
      saral: "Statutory ₹10 fee settled instantly via official government gateway",
    },
  ];

  return (
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#0f1a1f] text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
        
        {/* About Hero Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[32px] leading-10 sm:text-[44px] sm:leading-[54px] font-semibold text-purple-900 dark:text-white tracking-tight leading-tight"
          >
            Who runs SARAL and how it handles <br />
            <span className="text-purple-600 dark:text-purple-300 italic font-normal">
              your RTI application
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-[17px] sm:leading-7 text-slate-600 dark:text-slate-300 font-normal"
          >
            The Right to Information Act, 2005 gave every Indian citizen the constitutional authority under Article 19(1)(a) to question public expenditure. SARAL removes the bureaucratic hurdles, literacy barriers, and procedural rejections that stood in between.
          </motion.p>
        </section>

        {/* 3 Core Ethical Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6" data-purpose="ethical-pillars">
          <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="label-caps px-2.5 py-1 rounded-sm bg-[#cae7f2] text-purple-600 dark:bg-white/10 dark:text-slate-200">Pillar 01</span>
              <IcBrain className="w-5 h-5 text-purple-600 dark:text-slate-300" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="text-xl leading-7 font-semibold text-purple-900 dark:text-white">
              Intelligent Assistance, Not Hallucination
            </h3>
            <p className="text-[15px] leading-6 text-slate-600 dark:text-slate-300">
              SARAL AI does not fabricate government records or issue answers on behalf of the state. It acts strictly as an assistant to formulate citizen queries and help officers discover archive files.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="label-caps px-2.5 py-1 rounded-sm bg-[#ffdbcc] text-cyan-800 dark:bg-white/10 dark:text-slate-200">Pillar 02</span>
              <IcShieldCheck className="w-5 h-5 text-cyan-700 dark:text-slate-300" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="text-xl leading-7 font-semibold text-purple-900 dark:text-white">
              Public Authority Officer (PIO) Scrutiny
            </h3>
            <p className="text-[15px] leading-6 text-slate-600 dark:text-slate-300">
              Every official response must be reviewed, approved, and digitally certified by the designated Public Information Officer (PIO) under Section 7 of the RTI Act before reaching the citizen.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-xl bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 space-y-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <span className="label-caps px-2.5 py-1 rounded-sm bg-[#c9eadd] text-[#2f4c43] dark:bg-white/10 dark:text-slate-200">Pillar 03</span>
              <IcLock className="w-5 h-5 text-[#2a473e] dark:text-slate-300" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="text-xl leading-7 font-semibold text-purple-900 dark:text-white">
              Sovereignty & Citizen Privacy
            </h3>
            <p className="text-[15px] leading-6 text-slate-600 dark:text-slate-300">
              Built in strict adherence with India&apos;s Digital Personal Data Protection (DPDP) Act, 2023. Citizen identities and queries are encrypted and protected from unauthorized disclosure.
            </p>
          </div>
        </section>

        {/* Traditional RTI vs. SARAL Comparison Table */}
        <section className="p-6 sm:p-8 lg:p-10 rounded-xl bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 shadow-sm overflow-x-auto space-y-6 transition-colors">
          <div className="space-y-1">
            <span className="label-caps text-purple-600 dark:text-purple-300">
              Comparative Analysis
            </span>
            <h2 className="text-2xl leading-8 sm:text-[30px] sm:leading-[38px] font-semibold text-purple-900 dark:text-white">
              Traditional RTI Process vs. SARAL Digital Infrastructure
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm sm:text-[15px] border-collapse">
              <thead>
                <tr className="bg-[#eaf5fd] dark:bg-white/5 text-slate-600 dark:text-slate-300">
                  <th className="py-3.5 px-4 font-semibold rounded-l-lg">Aspect</th>
                  <th className="py-3.5 px-4 font-semibold text-rose-700 dark:text-rose-300">Traditional RTI Process</th>
                  <th className="py-3.5 px-4 font-semibold text-[#2f4c43] dark:text-emerald-400 rounded-r-lg">SARAL Digital Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-white/5">
                {comparison.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-4 font-semibold text-slate-900 dark:text-white">
                      {row.feature}
                    </td>
                    <td className="py-4 px-4 text-slate-600 dark:text-slate-300">
                      <span className="text-rose-700 mr-2" aria-hidden="true">×</span>
                      {row.traditional}
                    </td>
                    <td className="py-4 px-4 text-[#2f4c43] dark:text-emerald-300">
                      <span className="text-[#2a473e] mr-2" aria-hidden="true">✓</span>
                      {row.saral}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Real Citizen Stories Section */}
        <section className="space-y-8" data-purpose="citizen-stories">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="label-caps inline-flex items-center gap-2 text-purple-600 dark:text-purple-300">
              Example cases
            </span>
            <h2 className="text-2xl leading-8 sm:text-[30px] sm:leading-[38px] font-semibold text-purple-900 dark:text-white">
              What an RTI application can get answered
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Illustrative cases based on common RTI requests. They are examples, not reviews from SARAL users.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {citizenStories.map((story) => (
              <div
                key={story.id}
                className="p-6 rounded-xl bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 flex flex-col justify-between space-y-4 shadow-sm dark:shadow-xl hover:border-purple-400/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div>
                      <h4 className="font-display font-semibold text-lg text-purple-900 dark:text-white">{story.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{story.location}</p>
                    </div>
                  </div>

                  <span className="inline-block px-3 py-0.5 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    {story.concern}
                  </span>

                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {story.quote}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1 text-xs">
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
                    What the reply can lead to:
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                    {story.outcome}
                  </p>
                  <div className="flex items-center justify-between pt-2 text-xs text-slate-500 dark:text-slate-300 font-mono">
                    <span>{story.department}</span>
                    <span className="text-purple-600 dark:text-purple-300 font-bold">{story.statutoryDays}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="rounded-xl bg-purple-600 p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden shadow-lg">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl leading-8 sm:text-[30px] sm:leading-[38px] font-semibold">
              Have Questions or Need Assistance?
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              Our citizen helpdesk is available to assist you with filing procedures, fee exemptions, and department identification.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-lg font-semibold text-sm sm:text-base bg-white text-purple-900 hover:bg-slate-100 shadow-sm transition-colors"
            >
              Contact Citizen Helpdesk →
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-lg font-semibold text-sm sm:text-base bg-white/15 hover:bg-white/20 text-white transition-colors"
            >
              File an RTI Petition
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
