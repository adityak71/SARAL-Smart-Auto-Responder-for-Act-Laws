"use client";

import Link from "next/link";
import { motion } from "framer-motion";
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
    <div className="flex-1 w-full bg-slate-50 dark:bg-[#08031d] text-slate-800 dark:text-slate-100 flex flex-col antialiased transition-colors">
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16 space-y-16">
        
        {/* About Hero Header */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider"
          >
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Sovereign Citizen Empowerment Mission</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight"
          >
            Democratizing Right to Information <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 dark:from-purple-300 dark:via-indigo-200 dark:to-cyan-300">
              with Ethical Civic Technology.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal"
          >
            The Right to Information Act, 2005 gave every Indian citizen the constitutional authority under Article 19(1)(a) to question public expenditure. SARAL removes the bureaucratic hurdles, literacy barriers, and procedural rejections that stood in between.
          </motion.p>
        </section>

        {/* 3 Core Ethical Pillars */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6" data-purpose="ethical-pillars">
          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0529] border border-slate-200/90 dark:border-white/10 space-y-3.5 shadow-sm dark:shadow-xl transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/15 border border-purple-500/30 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xl">
              🎯
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Intelligent Assistance, Not Hallucination
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              SARAL AI does not fabricate government records or issue answers on behalf of the state. It acts strictly as an assistant to formulate citizen queries and help officers discover archive files.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0529] border border-slate-200/90 dark:border-white/10 space-y-3.5 shadow-sm dark:shadow-xl transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-xl">
              ⚖️
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Public Authority Officer (PIO) Scrutiny
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Every official response must be reviewed, approved, and digitally certified by the designated Public Information Officer (PIO) under Section 7 of the RTI Act before reaching the citizen.
            </p>
          </div>

          <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0c0529] border border-slate-200/90 dark:border-white/10 space-y-3.5 shadow-sm dark:shadow-xl transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 flex items-center justify-center font-bold text-xl">
              🛡️
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              Sovereignty & Citizen Privacy
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Built in strict adherence with India&apos;s Digital Personal Data Protection (DPDP) Act, 2023. Citizen identities and queries are encrypted and protected from unauthorized disclosure.
            </p>
          </div>
        </section>

        {/* Traditional RTI vs. SARAL Comparison Table */}
        <section className="p-6 sm:p-8 lg:p-10 rounded-3xl bg-white dark:bg-[#0c0529] border border-slate-200/90 dark:border-white/10 shadow-sm dark:shadow-xl overflow-x-auto space-y-6 transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 dark:text-purple-300">
              Comparative Analysis
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              Traditional RTI Process vs. SARAL Digital Infrastructure
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                  <th className="pb-3.5 font-semibold">Aspect</th>
                  <th className="pb-3.5 font-semibold text-rose-600 dark:text-rose-300">Traditional RTI Process</th>
                  <th className="pb-3.5 font-semibold text-emerald-600 dark:text-emerald-400">SARAL Digital Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/70 dark:divide-white/5">
                {comparison.map((row) => (
                  <tr key={row.feature} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 font-bold text-slate-900 dark:text-white pr-4">
                      {row.feature}
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-300 pr-4">
                      <span className="text-rose-500 mr-1.5">✕</span>
                      {row.traditional}
                    </td>
                    <td className="py-4 text-emerald-700 dark:text-emerald-300 font-medium">
                      <span className="text-emerald-500 mr-1.5">✓</span>
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
            <span className="px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
              Real Ground Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Real Citizens. Real Answers. Real Change.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              SARAL brings genuine human empowerment to citizens across India who needed clarity on public funds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {citizenStories.map((story) => (
              <div
                key={story.id}
                className="p-6 rounded-3xl bg-white dark:bg-[#0c0529] border border-slate-200/90 dark:border-white/10 flex flex-col justify-between space-y-4 shadow-sm dark:shadow-xl hover:border-purple-400/50 transition-colors"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={story.avatar}
                      alt={story.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-purple-500/30"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-white">{story.name}</h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">{story.location}</p>
                    </div>
                  </div>

                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20">
                    {story.concern}
                  </span>

                  <p className="italic text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    {story.quote}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200 dark:border-white/10 space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase block">
                    Certified Outcome:
                  </span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    {story.outcome}
                  </p>
                  <div className="flex items-center justify-between pt-2 text-[10px] text-slate-500 font-mono">
                    <span>{story.department}</span>
                    <span className="text-purple-600 dark:text-purple-300 font-bold">{story.statutoryDays}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="rounded-3xl bg-gradient-to-br from-purple-900 via-indigo-900 to-[#0d062e] p-8 sm:p-12 text-center text-white space-y-6 relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Have Questions or Need Assistance?
            </h2>
            <p className="text-xs sm:text-sm text-purple-200/90 leading-relaxed">
              Our citizen helpdesk is available to assist you with filing procedures, fee exemptions, and department identification.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 relative z-10 pt-2">
            <Link
              href="/contact"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white text-purple-950 hover:bg-slate-100 shadow-lg hover:shadow-xl transition-all"
            >
              Contact Citizen Helpdesk →
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white transition-all"
            >
              File an RTI Petition
            </Link>
          </div>
        </section>

      </main>
    </div>
  );
}
