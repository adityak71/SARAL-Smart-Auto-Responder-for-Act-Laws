"use client";

import { useState } from "react";
import { officerDashboardStats, officerReviewQueue } from "@/data/dashboardData";

export default function OfficerWorkspace() {
  const [selectedCase, setSelectedCase] = useState(officerReviewQueue[0]);
  const [approvedCases, setApprovedCases] = useState([]);
  const [draftText, setDraftText] = useState(selectedCase?.draftSummary || "");

  const handleSelectCase = (c) => {
    setSelectedCase(c);
    setDraftText(c.draftSummary);
  };

  const handleApprove = () => {
    if (!approvedCases.includes(selectedCase.id)) {
      setApprovedCases([...approvedCases, selectedCase.id]);
    }
  };

  const isApproved = approvedCases.includes(selectedCase?.id);

  return (
    <div className="space-y-6">
      {/* Officer Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Assigned Queue</span>
          <span className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1 block">
            {officerDashboardStats.assignedApplications}
          </span>
          <span className="text-[11px] text-amber-700 dark:text-amber-300 font-semibold">3 High Priority</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">AI Drafts Ready</span>
          <span className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mt-1 block">
            {officerDashboardStats.aiDraftsGenerated}
          </span>
          <span className="text-[11px] text-purple-600 dark:text-purple-200">Pre-retrieved from archives</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Dispatched Today</span>
          <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 block">
            {officerDashboardStats.dispatchedToday + approvedCases.length}
          </span>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-300 font-semibold">Digitally Certified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Statutory Compliance</span>
          <span className="text-2xl font-extrabold text-cyan-700 dark:text-cyan-400 mt-1 block">
            {officerDashboardStats.complianceRatio}
          </span>
          <span className="text-[11px] text-cyan-600 dark:text-cyan-300 font-semibold">Zero Overdue Appeals</span>
        </div>
      </div>

      {/* Main Split Review Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Assigned Queue List (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-5 shadow-sm dark:shadow-xl flex flex-col gap-3 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Pending Examination Queue
            </h3>
            <span className="text-xs text-purple-700 dark:text-purple-300 font-mono font-bold">
              {officerReviewQueue.length} Active Petitions
            </span>
          </div>

          <div className="space-y-2.5">
            {officerReviewQueue.map((item) => {
              const isSelected = selectedCase?.id === item.id;
              const hasBeenApproved = approvedCases.includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectCase(item)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-purple-50 dark:bg-purple-950/50 border-purple-500 dark:border-purple-400/80 shadow-md"
                      : "bg-slate-50 dark:bg-white/[0.03] border-slate-200 dark:border-white/5 hover:bg-slate-100 dark:hover:bg-white/[0.06]"
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-mono text-purple-700 dark:text-purple-300 font-bold">
                      {item.id}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        hasBeenApproved
                          ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30"
                          : item.urgency.includes("Critical")
                          ? "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-500/30"
                          : "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-500/30"
                      }`}
                    >
                      {hasBeenApproved ? "Approved & Dispatched" : item.urgency}
                    </span>
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {item.subject}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Applicant: {item.citizen} • Due in {item.daysRemaining} days
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Officer Verification & AI Draft Editor (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col gap-5 text-slate-800 dark:text-slate-100 transition-colors">
          <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <span className="text-xs font-mono text-purple-700 dark:text-purple-300 font-bold">
                {selectedCase?.id}
              </span>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                {selectedCase?.subject}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Citizen: {selectedCase?.citizen} • Target: {selectedCase?.suggestedDepartment}
              </p>
            </div>

            <span className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold">
              {selectedCase?.aiMatchScore}
            </span>
          </div>

          {/* AI Pre-Retrieved Source Files */}
          <div className="space-y-1.5 text-xs">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Pre-Retrieved Public Records & Gazettes:
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedCase?.suggestedSources.map((source) => (
                <span
                  key={source}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-purple-800 dark:text-purple-200 text-xs font-mono"
                >
                  📄 {source}
                </span>
              ))}
            </div>
          </div>

          {/* AI Draft Response Editor */}
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-xs">
                AI Suggested Response Memorandum (Section 7 Compliant):
              </span>
              <span className="text-[10px] text-purple-700 dark:text-purple-300 font-semibold">
                Officer can edit before digital seal
              </span>
            </div>

            <textarea
              rows={5}
              value={draftText}
              onChange={(e) => setDraftText(e.target.value)}
              disabled={isApproved}
              className="w-full p-3.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500 resize-none font-sans"
            />
          </div>

          {/* Officer Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {isApproved
                ? "✓ Digitally signed with Officer Class 3 PKI Certificate"
                : "Response will be dispatched directly to Citizen DigiLocker."}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {!isApproved ? (
                <>
                  <button
                    type="button"
                    onClick={handleApprove}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition cursor-pointer"
                  >
                    Approve & Apply Digital Seal
                  </button>
                  <button
                    type="button"
                    className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-xs font-semibold transition cursor-pointer"
                  >
                    Request Clarification
                  </button>
                </>
              ) : (
                <span className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  ✓ Response Dispatched Successfully
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
