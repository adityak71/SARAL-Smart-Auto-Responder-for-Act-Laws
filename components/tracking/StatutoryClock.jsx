"use client";

export default function StatutoryClock({ application }) {
  if (!application) return null;

  const { totalDaysAllowed, daysElapsed, daysRemaining, status, statutoryDeadline } =
    application;
  const isOverdue = daysRemaining <= 0 && status === "appeal_open";
  const percentage = Math.min(100, Math.round((daysElapsed / totalDaysAllowed) * 100));

  return (
    <div className="w-full bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col gap-5 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-wider block">
            Statutory Compliance Clock
          </span>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            Section 7(1) Statutory Response Timer
          </h3>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
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
            className={`h-full rounded-full transition-all duration-500 ${
              isOverdue
                ? "bg-gradient-to-r from-rose-500 to-red-600"
                : status === "completed"
                ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                : "bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
          <span>Date Filed: {application.dateFiled}</span>
          <span>Statutory Deadline: {statutoryDeadline}</span>
        </div>
      </div>

      {/* Appeal Advisory Banner if overdue */}
      {isOverdue && (
        <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/30 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-300 font-bold text-xs">
            <span>⚠️</span>
            <span>Section 19(1) First Appeal Unlocked</span>
          </div>
          <p className="text-[11px] text-slate-700 dark:text-slate-300 leading-snug">
            The Public Information Officer has not provided certified records within the 30-day statutory period. SARAL has auto-drafted your First Appeal memorandum.
          </p>
          <button
            type="button"
            className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs transition shadow-md cursor-pointer"
          >
            Submit First Appeal to Appellate Authority (FAA)
          </button>
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
