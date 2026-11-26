"use client";

import { helpdeskOffices } from "@/data/contactData";
import { Mail as IcMail, Phone as IcPhone } from "lucide-react";

export default function HelpdeskInfo() {
  return (
    <div className="space-y-6">
      {/* Toll Free Banner */}
      <div className="p-6 rounded-3xl bg-purple-100/80 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-500/25 shadow-sm dark:shadow-xl text-slate-800 dark:text-slate-100 flex flex-col gap-2 transition-colors">
        <span className="text-xs font-bold text-purple-700 dark:text-purple-300 tracking-wider">
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
        <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider">
          Physical RTI Facilitation Cells
        </h3>

        <div className="space-y-3">
          {helpdeskOffices.map((office) => (
            <div
              key={office.city}
              className="p-4 rounded-2xl bg-white dark:bg-[#1a2330] border border-slate-200/90 dark:border-white/10 space-y-2 text-xs text-slate-700 dark:text-slate-300 shadow-sm dark:shadow-md transition-colors"
            >
              <span className="font-bold text-slate-900 dark:text-white block text-sm">
                {office.city}
              </span>
              <p className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                {office.name}
              </p>
              <p className="text-slate-600 dark:text-slate-400 leading-snug">
                {office.address}
              </p>
              <div className="pt-1 flex flex-wrap items-center gap-3 text-xs">
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
