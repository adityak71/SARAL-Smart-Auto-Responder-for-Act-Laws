"use client";

import Link from "next/link";
import CitizenOverview from "@/components/dashboard/CitizenOverview";
import ApplicationListTable from "@/components/dashboard/ApplicationListTable";
import { Scale as IcScale } from "lucide-react";

export default function CitizenDashboard({ user }) {
  const citizenName =
    user?.fullName ||
    user?.name ||
    (user?.email
      ? user.email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase())
      : "Citizen Applicant");

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner & Quick Actions */}
      <div className="p-6 sm:p-8 rounded-3xl bg-purple-700 dark:bg-purple-950/70 border border-purple-400/40 dark:border-purple-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden transition-colors">

        <div className="space-y-2 z-10">
          {user?.isDigiLockerVerified ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              DigiLocker Verified Citizen • Section 6(1) Authorized
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-bold tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              Citizen Account • Verification Pending
            </div>
          )}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My RTI applications
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Signed in as {citizenName}. Draft a new application, check each 30-day deadline and download certified replies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
          <Link
            href="/file-rti"
            className="px-5 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-lg transition-colors transform cursor-pointer flex items-center gap-2"
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
            <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" />
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

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/appeal"
            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 shadow-sm transition"
          >
            File First Appeal →
          </Link>
          <Link
            href="/tracking?id=SARAL-2026-00124"
            className="px-4 py-2 rounded-xl text-xs font-semibold text-amber-700 dark:text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 transition"
          >
            Check Deadlines
          </Link>
        </div>
      </div>
    </div>
  );
}
