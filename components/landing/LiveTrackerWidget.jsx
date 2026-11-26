"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { mockRtiApplications } from "@/data/trackingData";

export default function LiveTrackerWidget() {
  const [query, setQuery] = useState("SARAL-2026-00124");
  const [selectedApp, setSelectedApp] = useState(mockRtiApplications[0]);

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanQuery = query.trim().toUpperCase();
    const match = mockRtiApplications.find(
      (app) =>
        app.id.toUpperCase() === cleanQuery ||
        app.id.toUpperCase().includes(cleanQuery) ||
        app.citizenName.toUpperCase().includes(cleanQuery)
    );
    if (match) {
      setSelectedApp(match);
    }
  };

  const handleSampleClick = (app) => {
    setQuery(app.id);
    setSelectedApp(app);
  };

  return (
    <section className="w-full py-12 lg:py-16 bg-[#1a2330]/70 border-y border-white/5 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left Text & Search Input */}
          <div className="w-full lg:w-1/2 flex flex-col gap-4 text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold w-fit">
              <span className="w-2 h-2 rounded-full bg-cyan-400" />
              <span>LIVE RTI TRACKING TERMINAL</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Track Your RTI Progress in Real-Time
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every RTI petition filed through SARAL receives a unique statutory tracking reference. Follow the statutory 30-day response clock, verify officer assignments, and download certified responses.
            </p>

            {/* Quick Search Form */}
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-2.5 pt-2">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter Application ID e.g. SARAL-2026-00124"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/15 focus:border-purple-400 focus:outline-none text-white text-sm placeholder-slate-400 font-mono"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-md transition whitespace-nowrap cursor-pointer"
              >
                Inspect Status
              </button>
            </form>

            {/* 1-Click Sample Test Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="text-slate-400 font-medium">Quick Test Cases:</span>
              {mockRtiApplications.map((app) => (
                <button
                  key={app.id}
                  type="button"
                  onClick={() => handleSampleClick(app)}
                  className={`px-2.5 py-1 rounded-lg border text-xs transition cursor-pointer ${
                    selectedApp.id === app.id
                      ? "bg-purple-600/30 border-purple-400 text-purple-200 font-bold"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {app.id}
                </button>
              ))}
            </div>
          </div>

          {/* Right Live Preview Card */}
          <div className="w-full lg:w-1/2">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedApp.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.25 }}
                className="p-5 sm:p-6 rounded-2xl bg-[#1d2733] border border-purple-500/25 shadow-xl flex flex-col gap-4 text-slate-100"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono text-purple-300 font-bold">
                      {selectedApp.id}
                    </span>
                    <h3 className="text-base font-bold text-white mt-0.5 leading-snug">
                      {selectedApp.title}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Citizen: {selectedApp.citizenName} • {selectedApp.citizenLocation}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-bold shrink-0 ${
                      selectedApp.status === "completed"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : selectedApp.status === "appeal_open"
                        ? "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                        : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    }`}
                  >
                    {selectedApp.statusLabel}
                  </span>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                    <span className="text-xs text-slate-400 block">Department</span>
                    <span className="font-semibold text-white truncate block">
                      {selectedApp.department}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5">
                    <span className="text-xs text-slate-400 block">Assigned PIO</span>
                    <span className="font-semibold text-purple-300 truncate block">
                      {selectedApp.pioDetails.name}
                    </span>
                  </div>
                </div>

                {/* Mini Progress Bar */}
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400 text-xs">
                    <span>Statutory 30-Day Window</span>
                    <span className="text-purple-300 font-bold">
                      Day {selectedApp.daysElapsed} of {selectedApp.totalDaysAllowed}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-purple-500 rounded-full"
                      style={{
                        width: `${Math.min(100, (selectedApp.daysElapsed / selectedApp.totalDaysAllowed) * 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Action button */}
                <div className="pt-1 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Filed on {selectedApp.dateFiled}
                  </span>
                  <Link
                    href={`/tracking?id=${selectedApp.id}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md transition"
                  >
                    <span>Open Full Tracking Dossier</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Link>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
