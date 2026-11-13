"use client";

import Link from "next/link";
import { citizenDashboardStats } from "@/data/dashboardData";

export default function CitizenOverview() {
  const stats = [
    {
      label: "Active In-Review",
      value: citizenDashboardStats.activeFilings,
      subtext: "Currently under PIO examination",
      color: "amber",
      icon: "⏳",
    },
    {
      label: "Completed Responses",
      value: citizenDashboardStats.resolvedFilings,
      subtext: "Certified documents available",
      color: "emerald",
      icon: "✓",
    },
    {
      label: "First Appeals",
      value: citizenDashboardStats.appealsPending,
      subtext: "Section 19(1) window active",
      color: "rose",
      icon: "⚠️",
    },
    {
      label: "Average Turnaround",
      value: `${citizenDashboardStats.averageResponseDays} Days`,
      subtext: "Well within 30-day mandate",
      color: "purple",
      icon: "⚡",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-purple-950/60 via-indigo-950/40 to-slate-900 border border-purple-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold mb-1">
            <span>✓ DigiLocker Verified Citizen ID</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Welcome back, Rahul Sharma
          </h2>
          <p className="text-xs text-slate-300">
            Track your Right to Information applications and access certified public disclosures.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/file-rti"
            className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs sm:text-sm shadow-md transition cursor-pointer"
          >
            + File New RTI Petition
          </Link>
          <Link
            href="/tracking"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/15 font-semibold text-xs sm:text-sm transition cursor-pointer"
          >
            Track Application ID
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md flex flex-col gap-2 text-slate-800 dark:text-slate-100 transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                {stat.label}
              </span>
              <span className="text-base">{stat.icon}</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {stat.value}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {stat.subtext}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
