"use client";

import { motion } from "framer-motion";
import { Scale as IcScale, Shield as IcShield, Target as IcTarget } from "lucide-react";

export default function AboutSection() {
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
  ];

  return (
    <section id="about" className="w-full py-16 lg:py-24 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-bold tracking-wider">
            <span>ABOUT SARAL MISSION</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Democratizing Right to Information with Ethical AI
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The Right to Information Act, 2005 gave every Indian citizen the constitutional authority to question public expenditure. SARAL removes the literacy and bureaucratic friction that stood in between.
          </p>
        </div>

        {/* 3 Core Ethical Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-300 flex items-center justify-center font-bold text-lg">
              <IcTarget className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-base text-white">Intelligent Assistance, Not Hallucination</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              SARAL AI does not invent government records or issue answers on behalf of the state. It acts strictly as an assistant to formulate citizen queries and help officers discover archived records.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 flex items-center justify-center font-bold text-lg">
              <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-base text-white">Public Authority Scrutiny (PIO)</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every official response must be reviewed, approved, and digitally certified by the designated Public Information Officer (PIO) under Section 7 of the RTI Act before reaching the citizen.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/10 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center font-bold text-lg">
              <IcShield className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="font-bold text-base text-white">Sovereignty & Citizen Privacy</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built in strict adherence with India&apos;s Digital Personal Data Protection (DPDP) Act, 2023. Citizen identities and queries are encrypted and protected from unauthorized disclosure.
            </p>
          </div>
        </div>

        {/* Traditional RTI vs SARAL Comparison Table */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#1a2330] border border-purple-500/20 shadow-xl overflow-x-auto">
          <h3 className="text-lg font-bold text-white mb-4">
            Traditional RTI vs. SARAL AI Portal
          </h3>

          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs">
                <th className="pb-3 font-semibold">Aspect</th>
                <th className="pb-3 font-semibold text-rose-300">Traditional RTI Process</th>
                <th className="pb-3 font-semibold text-emerald-400">SARAL Digital Platform</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparison.map((row) => (
                <tr key={row.feature} className="hover:bg-white/[0.02]">
                  <td className="py-3.5 font-bold text-white whitespace-nowrap pr-4">
                    {row.feature}
                  </td>
                  <td className="py-3.5 text-slate-400 pr-4">
                    {row.traditional}
                  </td>
                  <td className="py-3.5 text-purple-200 font-medium">
                    ✓ {row.saral}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
