"use client";

import { useState, useEffect } from "react";
import { Scale as IcScale } from "lucide-react";
import DayCounter from "@/components/common/DayCounter";

const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;

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
    isOverdue: false,
    elapsedUnits: 1,
  });

  useEffect(() => {
    function updateClock() {
      const filed = new Date(dateFiled || Date.now()).getTime();
      let deadline = new Date(statutoryDeadline).getTime();

      // If no valid deadline provided, calculate default
      if (isNaN(deadline)) {
        deadline = filed + (isLifeOrLiberty ? 48 * HOUR_MS : 30 * DAY_MS);
      }

      const now = Date.now();
      const remainingMs = deadline - now;
      const elapsedMs = Math.max(0, now - filed);
      const absRemaining = Math.abs(remainingMs);

      setTimeLeft({
        days: Math.floor(absRemaining / DAY_MS),
        hours: Math.floor((absRemaining % DAY_MS) / HOUR_MS),
        minutes: Math.floor((absRemaining % HOUR_MS) / (1000 * 60)),
        isOverdue: remainingMs <= 0,
        // "Day 1" is the day of filing; a 48-hour request counts hours instead
        elapsedUnits: Math.floor(elapsedMs / (isLifeOrLiberty ? HOUR_MS : DAY_MS)) + 1,
      });
    }

    updateClock();
    // Minutes are the finest unit shown, so a slower tick is enough
    const interval = setInterval(updateClock, 30 * 1000);
    return () => clearInterval(interval);
  }, [dateFiled, statutoryDeadline, isLifeOrLiberty]);

  const isResolved =
    status === "RESPONSE_DISPATCHED" || status === "RESOLVED" || status === "COMPLETED";

  if (isResolved) {
    return (
      <span className="inline-flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-400">
        <span aria-hidden="true">✓</span>
        <span>Reply delivered</span>
      </span>
    );
  }

  const total = isLifeOrLiberty ? 48 : 30;
  const unit = isLifeOrLiberty ? "Hour" : "Day";
  const tone = timeLeft.isOverdue || isLifeOrLiberty ? "overdue" : timeLeft.days <= 7 ? "soon" : "normal";
  const remaining = timeLeft.isOverdue
    ? `Overdue by ${timeLeft.days} d ${timeLeft.hours} h`
    : timeLeft.days > 0
    ? `${timeLeft.days} d ${timeLeft.hours} h left`
    : `${timeLeft.hours} h ${timeLeft.minutes} min left`;

  if (size === "compact") {
    return (
      <DayCounter
        current={Math.min(timeLeft.elapsedUnits, timeLeft.isOverdue ? timeLeft.elapsedUnits : total)}
        total={total}
        unit={unit}
        tone={tone}
        note={remaining}
        className="w-48"
      />
    );
  }

  return (
    <div className="p-4 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 text-slate-800 dark:text-slate-100">
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-sm font-medium">
          {isLifeOrLiberty ? "Reply deadline, life or liberty (Section 7(1))" : "Reply deadline (Section 7(1))"}
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">
          {isLifeOrLiberty ? "48 hours" : "30 days"}
        </span>
      </div>

      <DayCounter current={timeLeft.elapsedUnits} total={total} unit={unit} tone={tone} note={remaining} />

      {timeLeft.isOverdue && (
        <div className="mt-3 p-3 rounded-lg bg-rose-500/10 text-rose-800 dark:text-rose-300 text-xs leading-relaxed">
          <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.5} aria-hidden="true" /> <strong>Section 7(2) Deemed Refusal:</strong> The 30-day statutory window has expired. The citizen is entitled to records <strong>free of cost</strong> under Section 7(6), and First Appeal can be filed immediately.
        </div>
      )}
    </div>
  );
}
