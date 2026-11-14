"use client";

import Link from "next/link";
import OfficerWorkspace from "@/components/dashboard/OfficerWorkspace";

export default function OfficerDashboard({ user }) {
  const officerName = user?.name || user?.fullName || "Er. Rameshwar Verma (PIO)";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Officer Bio & Department Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-800 to-slate-900 dark:from-purple-950/80 dark:via-slate-900 dark:to-indigo-950/70 border border-purple-400/40 dark:border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden transition-all">
        {/* Glow decoration */}
        <div className="absolute -left-10 -bottom-10 w-48 h-48 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30 text-xs font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping" />
            Public Information Officer (PIO) Portal • Section 5(1) Designated
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {officerName}
          </h2>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-300">
            <span><strong>Department:</strong> Public Works Department (PWD Division II)</span>
            <span>•</span>
            <span><strong>Jurisdiction:</strong> Pipariya & Hoshangabad Circle</span>
            <span>•</span>
            <span><strong>Employee ID:</strong> EMP-MP-PWD-4091</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
            Review citizen Section 6(1) petitions, verify pre-retrieved AI measurement books and voucher registers, and dispatch certified administrative orders before the 30-day statutory expiry.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0 z-10">
          <Link
            href="/general-info"
            className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md transition"
          >
            Statutory Rules Catalog
          </Link>
          <a
            href="#examination-queue"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold text-xs sm:text-sm transition"
          >
            Scroll to Queue ↓
          </a>
        </div>
      </div>

      {/* Main Interactive Split Workstation */}
      <div id="examination-queue">
        <OfficerWorkspace />
      </div>

      {/* Statutory Duty Advisory */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2.5">
          <span className="text-base">ℹ️</span>
          <span>
            <strong>Section 6(3) Transfer Rule:</strong> If requested records concern another public authority, the petition must be transferred within 5 statutory days with citizen intimation.
          </span>
        </div>
        <span className="font-mono text-purple-600 dark:text-purple-400 font-bold shrink-0">
          Act 22 of 2005
        </span>
      </div>
    </div>
  );
}
