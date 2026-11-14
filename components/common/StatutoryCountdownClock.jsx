"use client";

import { useState, useEffect } from "react";

export default function StatutoryCountdownClock({
  dateFiled,
  statutoryDeadline,
  isLifeOrLiberty = false,
  status = "UNDER_REVIEW",
  size = "normal", // "normal" | "compact"
}) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOverdue: false,
    percentElapsed: 0,
  });

  useEffect(() => {
    function updateClock() {
      const filed = new Date(dateFiled || Date.now()).getTime();
      let deadline = new Date(statutoryDeadline).getTime();

      // If no valid deadline provided, calculate default
      if (isNaN(deadline)) {
        deadline = filed + (isLifeOrLiberty ? 48 * 3600 * 1000 : 30 * 86400 * 1000);
      }

      const now = Date.now();
      const totalDuration = Math.max(1, deadline - filed);
      const remainingMs = deadline - now;
      const elapsedMs = now - filed;

      const isOverdue = remainingMs <= 0;
      const percentElapsed = Math.min(100, Math.max(0, Math.round((elapsedMs / totalDuration) * 100)));

      const absRemaining = Math.abs(remainingMs);
      const days = Math.floor(absRemaining / (1000 * 60 * 60 * 24));
      const hours = Math.floor((absRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((absRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((absRemaining % (1000 * 60)) / 1000);

      setTimeLeft({
        days,
        hours,
        minutes,
        seconds,
        isOverdue,
        percentElapsed,
      });
    }

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [dateFiled, statutoryDeadline, isLifeOrLiberty]);

  const isResolved =
    status === "RESPONSE_DISPATCHED" || status === "RESOLVED" || status === "COMPLETED";

  if (isResolved) {
    return (
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold font-mono">
        <span>✓</span>
        <span>Statutory Response Delivered</span>
      </div>
    );
  }

  if (size === "compact") {
    return (
      <div className="flex items-center gap-2">
        <span
          className={`font-mono text-xs font-bold ${
            timeLeft.isOverdue
              ? "text-rose-600 dark:text-rose-400"
              : isLifeOrLiberty
              ? "text-rose-600 dark:text-rose-400 animate-pulse"
              : timeLeft.days <= 7
              ? "text-amber-600 dark:text-amber-400"
              : "text-slate-700 dark:text-slate-200"
          }`}
        >
          {timeLeft.isOverdue
            ? `Overdue +${timeLeft.days}d`
            : `${timeLeft.days}d ${timeLeft.hours}h left`}
        </span>
        <div className="w-16 h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              timeLeft.isOverdue
                ? "bg-rose-500"
                : isLifeOrLiberty
                ? "bg-rose-500"
                : timeLeft.days <= 7
                ? "bg-amber-500"
                : "bg-cyan-500"
            }`}
            style={{ width: `${timeLeft.percentElapsed}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 rounded-2xl border transition-all ${
        timeLeft.isOverdue
          ? "bg-rose-500/10 border-rose-500/40 text-rose-900 dark:text-rose-200"
          : isLifeOrLiberty
          ? "bg-rose-500/15 border-rose-500/50 text-rose-900 dark:text-rose-200"
          : timeLeft.days <= 7
          ? "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
          : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 font-bold text-xs">
          <span>{isLifeOrLiberty ? "🚨 Section 7(1) Emergency Clock" : "⚖ Statutory RTI Countdown"}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-black/10 dark:bg-white/10 font-mono">
            {isLifeOrLiberty ? "48-Hour Limit" : "30-Day Mandate"}
          </span>
        </div>

        <span className="font-mono text-xs font-bold">
          {timeLeft.isOverdue ? (
            <span className="text-rose-600 dark:text-rose-400 font-extrabold">OVERDUE</span>
          ) : (
            `${30 - timeLeft.days}/30 Days`
          )}
        </span>
      </div>

      {/* Countdown Digits */}
      <div className="grid grid-cols-4 gap-2 text-center py-2">
        <div className="p-2 rounded-xl bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/10">
          <span className="block text-xl font-mono font-extrabold">{timeLeft.days}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500">Days</span>
        </div>
        <div className="p-2 rounded-xl bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/10">
          <span className="block text-xl font-mono font-extrabold">{timeLeft.hours}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500">Hours</span>
        </div>
        <div className="p-2 rounded-xl bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/10">
          <span className="block text-xl font-mono font-extrabold">{timeLeft.minutes}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500">Mins</span>
        </div>
        <div className="p-2 rounded-xl bg-white/60 dark:bg-black/40 border border-black/5 dark:border-white/10">
          <span className="block text-xl font-mono font-extrabold">{timeLeft.seconds}</span>
          <span className="text-[9px] uppercase tracking-wider text-slate-500">Secs</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mt-2 w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            timeLeft.isOverdue
              ? "bg-rose-600"
              : isLifeOrLiberty
              ? "bg-rose-500"
              : timeLeft.days <= 7
              ? "bg-amber-500"
              : "bg-emerald-500"
          }`}
          style={{ width: `${timeLeft.percentElapsed}%` }}
        />
      </div>

      {/* Overdue Warning */}
      {timeLeft.isOverdue && (
        <div className="mt-2.5 p-2 rounded-xl bg-rose-500/20 text-rose-800 dark:text-rose-300 text-[11px] leading-relaxed">
          ⚖ <strong>Section 7(2) Deemed Refusal:</strong> The 30-day statutory window has expired. The citizen is entitled to records <strong>free of cost</strong> under Section 7(6), and First Appeal can be filed immediately.
        </div>
      )}
    </div>
  );
}
