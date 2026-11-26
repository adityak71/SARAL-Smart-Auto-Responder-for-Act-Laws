"use client";

import Link from "next/link";
import { TriangleAlert as IcTriangleAlert } from "lucide-react";

export default function StatutoryClock({ application }) {
  if (!application) return null;

  const { totalDaysAllowed, daysElapsed, daysRemaining, status, statutoryDeadline } =
    application;
  const isOverdue = daysRemaining <= 0 && status === "appeal_open";
  const percentage = Math.min(100, Math.round((daysElapsed / totalDaysAllowed) * 100));

  return (
    <div className="w-full bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-5 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span className="label-caps text-slate-500 dark:text-slate-400 block">
            Statutory Compliance Clock
          </span>
          <h3 className="font-display text-lg leading-7 font-semibold text-purple-900 dark:text-white">
            Section 7(1) Statutory Response Timer
          </h3>
        </div>

        <span
          className={`px-3 py-1 rounded-lg text-xs font-bold ${
            isOverdue
              ? "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30"
              : status === "completed"
              ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
              : "bg-cyan-500/15 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-500/30"
          }`}
        >
          {status === "completed"
            ? "Completed Within Mandate"
            : isOverdue
            ? "30-Day Limit Elapsed"
            : `${daysRemaining} Days Left`}
        </span>
      </div>

      {/* Progress Bar & Days Indicator */}
      <div className="space-y-2">
        <div className="flex justify-between items-baseline text-xs">
          <span className="text-slate-600 dark:text-slate-300">
            Mandatory Clock: <strong className="text-slate-900 dark:text-white">Day {daysElapsed}</strong> of {totalDaysAllowed}
          </span>
          <span className="text-purple-700 dark:text-purple-300 font-mono font-bold">{percentage}% Time Used</span>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-white/10 p-0.5 overflow-hidden border border-slate-200 dark:border-transparent">
          <div
            className={`h-full rounded-full transition-colors duration-500 ${
              isOverdue
                ? " bg-rose-500 "
                : status === "completed"
                ? " bg-emerald-500 "
                : " bg-purple-500  "
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 pt-1">
          <span>Date Filed: {application.dateFiled}</span>
          <span>Statutory Deadline: {statutoryDeadline}</span>
        </div>
      </div>

      {/* Appeal Advisory Banner if overdue */}
      {isOverdue && (
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
            <span><IcTriangleAlert className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
            <span>Section 19(1) First Appeal Unlocked</span>
          </div>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-snug">
            The Public Information Officer has not provided certified records within the 30-day statutory period. SARAL has auto-drafted your First Appeal memorandum.
          </p>
          <Link
            href={`/appeal?id=${application.id}`}
            className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-md cursor-pointer text-center block"
          >
            Submit First Appeal to Appellate Authority (FAA)
          </Link>
        </div>
      )}

      {/* Statutory Exemption & Fee Verification Note */}
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
        <span>Treasury Fee Status:</span>
        <strong className="text-emerald-600 dark:text-emerald-400 font-mono">{application.feeStatus}</strong>
      </div>
    </div>
  );
}
