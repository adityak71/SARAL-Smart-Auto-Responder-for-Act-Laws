"use client";

import { useState } from "react";
import Link from "next/link";
import { mockRtiApplications } from "@/data/trackingData";

export default function ApplicationListTable() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredApps = mockRtiApplications.filter((app) => {
    const matchesFilter =
      filter === "all" ||
      (filter === "in_review" && app.status === "in_review") ||
      (filter === "completed" && app.status === "completed") ||
      (filter === "appeal_open" && app.status === "appeal_open");

    const matchesSearch =
      app.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.department.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col gap-5 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            My Filed RTI Applications
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time status updates from designated Public Information Officers
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID or department..."
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-300/80 dark:border-white/15 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 w-full sm:w-56"
            />
            <svg
              className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === "all" ? "bg-purple-600 text-white font-bold shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("in_review")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === "in_review" ? "bg-amber-600 text-white font-bold shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              In Review
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === "completed" ? "bg-emerald-600 text-white font-bold shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Resolved
            </button>
            <button
              type="button"
              onClick={() => setFilter("appeal_open")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === "appeal_open" ? "bg-rose-600 text-white font-bold shadow-sm" : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Appeals
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
              <th className="pb-3 font-semibold">Reference ID</th>
              <th className="pb-3 font-semibold">Subject &amp; Department</th>
              <th className="pb-3 font-semibold">Date Filed</th>
              <th className="pb-3 font-semibold">Statutory Clock</th>
              <th className="pb-3 font-semibold">Current Status</th>
              <th className="pb-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/70 dark:divide-white/5">
            {filteredApps.map((app) => (
              <tr key={app.id} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition">
                <td className="py-4 pr-3 font-mono font-bold text-purple-700 dark:text-purple-300">
                  {app.id}
                </td>

                <td className="py-4 pr-3">
                  <div className="font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                    {app.title}
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {app.department}
                  </div>
                </td>

                <td className="py-4 pr-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                  {app.dateFiled}
                </td>

                <td className="py-4 pr-3 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-200">
                      Day {app.daysElapsed}/30
                    </span>
                    <div className="w-16 h-1.5 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden border border-slate-200 dark:border-transparent">
                      <div
                        className={`h-full rounded-full ${
                          app.status === "completed"
                            ? "bg-emerald-500"
                            : app.status === "appeal_open"
                            ? "bg-rose-500"
                            : "bg-cyan-400"
                        }`}
                        style={{ width: `${Math.min(100, (app.daysElapsed / 30) * 100)}%` }}
                      />
                    </div>
                  </div>
                </td>

                <td className="py-4 pr-3 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                      app.status === "completed"
                        ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                        : app.status === "appeal_open"
                        ? "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30"
                        : "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {app.statusLabel}
                  </span>
                </td>

                <td className="py-4 text-right whitespace-nowrap">
                  <Link
                    href={`/tracking?id=${app.id}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white dark:bg-purple-600/30 dark:hover:bg-purple-600 dark:text-purple-200 border border-purple-200 dark:border-purple-500/30 text-xs font-semibold transition"
                  >
                    <span>View Dossier</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredApps.length === 0 && (
          <div className="py-8 text-center text-slate-500 dark:text-slate-400 text-xs">
            No applications match your selected filter or search term.
          </div>
        )}
      </div>
    </div>
  );
}
