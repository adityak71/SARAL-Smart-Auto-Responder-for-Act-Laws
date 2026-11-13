"use client";

import Link from "next/link";
import CitizenOverview from "@/components/dashboard/CitizenOverview";
import ApplicationListTable from "@/components/dashboard/ApplicationListTable";

export default function CitizenDashboard({ user }) {
  const citizenName = user?.name || user?.fullName || "Rahul Sharma";

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-purple-950/70 via-indigo-950/50 to-slate-900 border border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            DigiLocker Verified Citizen • Section 6(1) Authorized
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Namaste, {citizenName}
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Welcome to your unified Right to Information dashboard. Draft new petitions, monitor statutory 30-day response clocks, and download official certified government memorandums.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
          <Link
            href="/file-rti"
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-purple-600/30 transition-all transform hover:-translate-y-0.5 cursor-pointer flex items-center gap-2"
          >
            <span>+ File New RTI Petition</span>
          </Link>
          <Link
            href="/tracking?id=SARAL-2026-00124"
            className="px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            Track Active Dossier
          </Link>
        </div>
      </div>

      {/* Real-Time Statutory Metric Cards */}
      <CitizenOverview />

      {/* Master Active Petitions Table */}
      <ApplicationListTable />

      {/* Section 19(1) First Appeal Advisory Notice */}
      <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-lg shrink-0">
            ⚖
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Statutory 30-Day Response Protection (Section 19)
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5 max-w-2xl">
              If a designated Public Information Officer fails to provide certified records within the 30-day statutory window, you have the right to file a First Appeal to the Appellate Authority at zero additional charge.
            </p>
          </div>
        </div>

        <Link
          href="/tracking?id=SARAL-2026-00124"
          className="px-4 py-2 rounded-xl text-xs font-bold text-amber-700 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition shrink-0"
        >
          Check Statutory Deadlines →
        </Link>
      </div>
    </div>
  );
}
