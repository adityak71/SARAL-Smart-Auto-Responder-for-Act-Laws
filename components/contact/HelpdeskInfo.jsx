"use client";

import { helpdeskOffices } from "@/data/contactData";
import { Mail as IcMail, Phone as IcPhone } from "lucide-react";

export default function HelpdeskInfo() {
  return (
    <div className="space-y-6">
      {/* Toll Free Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-[#e5eff8] dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/25 text-slate-800 dark:text-slate-100 flex flex-col gap-3 transition-colors">
        <span className="text-sm font-semibold text-purple-600 dark:text-purple-300">
          National Toll-Free Facilitation Helpline
        </span>
        <div className="font-display text-[32px] leading-10 sm:text-[40px] sm:leading-[48px] font-bold text-purple-900 dark:text-white">
          1800-11-7272
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Toll-free helpline operating Mon – Sat, 09:30 AM to 06:00 PM IST across all states and union territories.
        </p>
      </div>

      {/* Regional Nodal Desks */}
      <div className="space-y-3">
        <h3 className="font-sans text-base font-semibold text-purple-900 dark:text-white px-1">
          Physical RTI Facilitation Cells
        </h3>

        <div className="space-y-3">
          {helpdeskOffices.map((office) => (
            <div
              key={office.city}
              className="p-6 rounded-xl bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 space-y-2 text-sm text-slate-700 dark:text-slate-300 shadow-sm transition-colors"
            >
              <span className="font-display font-semibold text-purple-900 dark:text-white block text-lg">
                {office.city}
              </span>
              <p className="text-sm text-purple-500 dark:text-purple-300 font-medium">
                {office.name}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-snug">
                {office.address}
              </p>
              <div className="mt-3 pt-3 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                <span className="text-slate-500 dark:text-slate-400"><IcPhone className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> {office.phone}</span>
                <span className="text-slate-500 dark:text-slate-400"><IcMail className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> {office.email}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
