"use client";

import Link from "next/link";
import CitizenOverview from "@/components/dashboard/CitizenOverview";
import ApplicationListTable from "@/components/dashboard/ApplicationListTable";
import { Gavel as IcGavel, Landmark as IcLandmark, Plus as IcPlus, SearchCheck as IcSearchCheck, ChevronRight as IcChevronRight } from "lucide-react";

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
      <div className="p-8 sm:p-10 lg:p-12 rounded-xl bg-purple-600 dark:bg-[#16262d] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-8 relative overflow-hidden transition-colors">
        <IcLandmark className="hidden sm:block absolute -right-8 -bottom-12 w-72 h-72 text-white/[0.06] pointer-events-none" strokeWidth={1} aria-hidden="true" />
        <div className="space-y-4 z-10">
          {user?.isDigiLockerVerified ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-slate-100 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-[#c9eadd]" />
              DigiLocker Verified Citizen • Section 6(1) Authorized
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-900/60 text-cyan-200 text-xs font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-300" />
              Citizen Account • Verification Pending
            </div>
          )}
          <h2 className="text-[32px] leading-10 sm:text-[44px] sm:leading-[54px] font-semibold text-white tracking-[-0.02em]">
            Namaste, {citizenName}
          </h2>
          <p className="text-[15px] leading-6 sm:text-[17px] sm:leading-7 text-purple-300 max-w-2xl">
            Welcome to your unified Right to Information dashboard. Draft new petitions, monitor statutory 30-day response clocks, and download official certified government memorandums.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 z-10">
          <Link
            href="/file-rti"
            className="px-5 py-3 rounded-lg bg-white hover:bg-slate-100 text-purple-900 font-semibold text-sm sm:text-base shadow-sm transition-colors cursor-pointer flex items-center gap-2"
          >
            <IcPlus className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
            <span>File New RTI Petition</span>
          </Link>
          <Link
            href="/tracking?id=SARAL-2026-00124"
            className="px-5 py-3 rounded-lg bg-white/15 hover:bg-white/20 text-white font-semibold text-sm sm:text-base transition-colors cursor-pointer flex items-center gap-2"
          >
            <IcSearchCheck className="w-4 h-4" strokeWidth={1.75} aria-hidden="true" />
            <span>Track Active Dossier</span>
          </Link>
        </div>
      </div>

      {/* Real-Time Statutory Metric Cards */}
      <CitizenOverview />

      {/* Master Active Petitions Table */}
      <ApplicationListTable />

      {/* Section 19(1) First Appeal Advisory Notice */}
      <div className="p-5 sm:p-6 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-300/40 dark:border-white/10 text-slate-800 dark:text-slate-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-sm bg-slate-200 dark:bg-white/10 text-purple-900 dark:text-purple-200 flex items-center justify-center shrink-0">
            <IcGavel className="w-5 h-5" strokeWidth={1.75} aria-hidden="true" />
          </div>
          <div>
            <h4 className="text-base font-semibold text-slate-900 dark:text-white">
              Statutory 30-Day Response Protection (Section 19)
            </h4>
            <p className="text-[13px] leading-5 text-slate-600 dark:text-slate-300 mt-0.5 max-w-2xl">
              If a designated Public Information Officer fails to provide certified records within the 30-day statutory window, you have the right to file a First Appeal to the Appellate Authority at zero additional charge.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/appeal"
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-cyan-700 hover:bg-cyan-800 shadow-sm transition-colors inline-flex items-center gap-1"
          >
            File First Appeal <IcChevronRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
          </Link>
          <Link
            href="/tracking?id=SARAL-2026-00124"
            className="px-4 py-2.5 rounded-lg text-sm font-semibold text-purple-900 dark:text-purple-100 bg-white dark:bg-white/10 hover:bg-slate-50 border border-slate-300/60 dark:border-white/15 shadow-sm transition-colors"
          >
            Check Deadlines
          </Link>
        </div>
      </div>
    </div>
  );
}
