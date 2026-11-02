"use client";

import { helpdeskOffices } from "@/data/contactData";

export default function HelpdeskInfo() {
  return (
    <div className="space-y-6">
      {/* Toll Free Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-100/80 via-indigo-50 to-slate-100 dark:from-purple-900/40 dark:via-indigo-950/40 dark:to-slate-900 border border-purple-200 dark:border-purple-500/25 shadow-sm dark:shadow-xl text-slate-800 dark:text-slate-100 flex flex-col gap-2 transition-colors">
        <span className="text-[11px] uppercase font-bold text-purple-700 dark:text-purple-300 tracking-wider">
          National Toll-Free Facilitation Helpline
        </span>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-wide">
          1800-11-7272
        </div>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          Toll-free helpline operating Mon – Sat, 09:30 AM to 06:00 PM IST across all states and union territories.
        </p>
      </div>

      {/* Regional Nodal Desks */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
          Physical RTI Facilitation Cells
        </h3>

        <div className="space-y-3">
          {helpdeskOffices.map((office) => (
            <div
              key={office.city}
              className="p-4 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-white/10 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-md transition-colors"
            >
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                {office.city}
              </span>
              <p className="text-[11px] text-purple-700 dark:text-purple-300 font-medium">
                {office.name}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-snug">
                {office.address}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-[11px]">
                <span className="text-slate-500 dark:text-slate-400">📞 {office.phone}</span>
                <span className="text-slate-500 dark:text-slate-400">✉️ {office.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
