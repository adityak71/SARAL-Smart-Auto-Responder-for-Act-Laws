"use client";

import { useDispatch, useSelector } from "react-redux";
import {
  setSearchQuery,
  searchApplication,
  selectApplicationById,
} from "@/redux/slices/trackingSlice";

export default function TrackingSearchBar() {
  const dispatch = useDispatch();
  const { searchQuery, applications, selectedApplication, searchStatus } =
    useSelector((state) => state.tracking);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(searchApplication());
  };

  return (
    <div className="w-full bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col gap-4 text-slate-800 dark:text-slate-100 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
            Track RTI Application Lifecycle
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Enter your statutory reference ID or select a sample case below
          </p>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-semibold w-fit">
          <span>● 30-Day Mandatory Statutory Clock Active</span>
        </span>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-2.5">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <svg className="w-4.5 h-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            placeholder="e.g. SARAL-2026-00124 or Rahul Sharma"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-300/80 dark:border-white/15 focus:border-purple-500 focus:outline-none text-slate-900 dark:text-white text-sm placeholder-slate-400 font-mono tracking-wide"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-sm shadow-md transition whitespace-nowrap cursor-pointer"
        >
          Track Status
        </button>
      </form>

      {/* Quick Test Cases */}
      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium">Sample Test Applications:</span>
        {applications.map((app) => {
          const isSelected = selectedApplication?.id === app.id;
          return (
            <button
              key={app.id}
              type="button"
              onClick={() => dispatch(selectApplicationById(app.id))}
              className={`px-3 py-1.5 rounded-xl border text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? "bg-purple-600 text-white border-purple-500 font-bold shadow-md"
                  : "bg-slate-100 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-white/10"
              }`}
            >
              <span>{app.id}</span>
              <span className="text-[10px] opacity-75">({app.statusLabel.split(" ")[0]})</span>
            </button>
          );
        })}
      </div>

      {searchStatus === "not_found" && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs">
          No application found matching &ldquo;{searchQuery}&rdquo;. Try clicking one of the sample applications above.
        </div>
      )}
    </div>
  );
}
