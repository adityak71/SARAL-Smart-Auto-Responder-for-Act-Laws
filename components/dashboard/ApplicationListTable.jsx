"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { mockRtiApplications } from "@/data/trackingData";
import StatutoryCountdownClock from "@/components/common/StatutoryCountdownClock";
import DocumentPreviewModal from "@/components/common/DocumentPreviewModal";

export default function ApplicationListTable() {
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [previewState, setPreviewState] = useState({
    isOpen: false,
    documentType: "RECEIPT",
    application: null,
  });

  useEffect(() => {
    let isMounted = true;
    async function loadApplications() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.applications)) {
            if (isMounted) setApplications(data.applications);
            return;
          }
        }
        if (isMounted) setApplications([]);
      } catch (err) {
        console.warn("Applications fetch fallback:", err);
        if (isMounted) setApplications([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadApplications();
    return () => {
      isMounted = false;
    };
  }, []);

  const [referenceTime] = useState(() => Date.now());

  const enrichedApps = useMemo(() => {
    return applications.map((app) => {
      const filedTime = app.dateFiled ? new Date(app.dateFiled).getTime() : app.createdAt ? new Date(app.createdAt).getTime() : referenceTime;
      const filedDate = new Date(filedTime);
      const elapsedDays =
        app.daysElapsed !== undefined
          ? app.daysElapsed
          : Math.max(1, Math.floor((referenceTime - filedTime) / (1000 * 60 * 60 * 24)));

      const isResolved =
        app.status === "RESPONSE_DISPATCHED" ||
        app.status === "RESOLVED" ||
        app.status === "completed";
      const isAppeal =
        app.status === "FIRST_APPEAL_PENDING" ||
        app.status === "appeal_open" ||
        elapsedDays > 30;

      let category = "in_review";
      if (isResolved) category = "completed";
      else if (isAppeal) category = "appeal_open";

      let statusBadge = {
        label: "Under PIO Review",
        classes: "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/30",
      };
      if (isResolved) {
        statusBadge = {
          label: "Certified Response Ready",
          classes: "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/30",
        };
      } else if (isAppeal) {
        statusBadge = {
          label: "Section 19 Appeal Active",
          classes: "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-500/30",
        };
      }

      const formattedDate = filedDate.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

      return {
        ...app,
        idStr: app.applicationNumber || app.id,
        deptName: app.department?.name || app.targetAuthority || "Public Authority",
        formattedDate,
        elapsedDays,
        category,
        statusBadge,
        isResolved,
        isAppeal,
      };
    });
  }, [applications, referenceTime]);

  const filteredApps = useMemo(() => {
    return enrichedApps.filter((app) => {
      const matchesFilter =
        filter === "all" ||
        (filter === "in_review" && app.category === "in_review") ||
        (filter === "completed" && app.category === "completed") ||
        (filter === "appeal_open" && app.category === "appeal_open");

      const term = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !term ||
        app.title?.toLowerCase().includes(term) ||
        app.idStr?.toLowerCase().includes(term) ||
        app.deptName?.toLowerCase().includes(term);

      return matchesFilter && matchesSearch;
    });
  }, [enrichedApps, filter, searchTerm]);

  return (
    <div className="w-full bg-white dark:bg-[#0d062e] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-6 shadow-sm dark:shadow-xl flex flex-col gap-5 text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/10 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
            <span>My Filed RTI Applications</span>
            <span className="px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-700 dark:text-purple-300 text-xs font-mono font-bold">
              {filteredApps.length}
            </span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Real-time status updates synced with designated Public Information Officers
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
                filter === "all"
                  ? "bg-purple-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("in_review")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === "in_review"
                  ? "bg-amber-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              In Review
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === "completed"
                  ? "bg-emerald-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Resolved
            </button>
            <button
              type="button"
              onClick={() => setFilter("appeal_open")}
              className={`px-2.5 py-1 rounded-lg font-medium transition cursor-pointer ${
                filter === "appeal_open"
                  ? "bg-rose-600 text-white font-bold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Appeals
            </button>
          </div>
        </div>
      </div>

      {/* Applications Table / Cards */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
            <div className="w-7 h-7 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">Synchronizing applications with Supabase PostgreSQL...</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                <th className="pb-3 font-semibold">Reference ID</th>
                <th className="pb-3 font-semibold">Subject &amp; Authority</th>
                <th className="pb-3 font-semibold">Date Filed</th>
                <th className="pb-3 font-semibold">Statutory Clock</th>
                <th className="pb-3 font-semibold">Current Status</th>
                <th className="pb-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-white/5">
              {filteredApps.map((app) => (
                <tr key={app.id || app.idStr} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition">
                  <td className="py-4 pr-3 font-mono font-bold text-purple-700 dark:text-purple-300">
                    {app.idStr}
                  </td>

                  <td className="py-4 pr-3">
                    <div className="font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {app.title}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {app.deptName}
                    </div>
                  </td>

                  <td className="py-4 pr-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {app.formattedDate}
                  </td>

                  <td className="py-4 pr-3 whitespace-nowrap">
                    <StatutoryCountdownClock
                      dateFiled={app.dateFiled || app.createdAt}
                      statutoryDeadline={app.statutoryDeadline}
                      isLifeOrLiberty={app.isLifeOrLiberty}
                      status={app.status}
                      size="compact"
                    />
                  </td>

                  <td className="py-4 pr-3 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${app.statusBadge.classes}`}
                    >
                      {app.statusBadge.label}
                    </span>
                  </td>

                  <td className="py-4 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 justify-end flex-wrap">
                      {/* Statutory Receipt Preview & Download */}
                      <button
                        type="button"
                        onClick={() =>
                          setPreviewState({
                            isOpen: true,
                            documentType: "RECEIPT",
                            application: app,
                          })
                        }
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white dark:bg-purple-600/20 dark:hover:bg-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-500/30 text-[11px] font-semibold transition cursor-pointer"
                        title="View & Download Official Receipt"
                      >
                        <span>📄 Receipt</span>
                      </button>

                      {/* Certified Response Preview & Download */}
                      {app.isResolved && (
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewState({
                              isOpen: true,
                              documentType: "CERTIFIED_RESPONSE",
                              application: app,
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-600 text-emerald-700 hover:text-white dark:bg-emerald-600/20 dark:hover:bg-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-bold transition cursor-pointer"
                        >
                          <span>📜 Certified PDF</span>
                        </button>
                      )}

                      {app.isAppeal && (
                        <Link
                          href={`/appeal?id=${app.idStr}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-700 hover:text-white dark:bg-rose-600/20 dark:hover:bg-rose-600 dark:text-rose-300 border border-rose-200 dark:border-rose-500/30 text-[11px] font-bold transition"
                        >
                          <span>File Appeal</span>
                        </Link>
                      )}

                      <Link
                        href={`/tracking?id=${app.idStr}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-200 text-xs font-semibold border border-slate-200 dark:border-white/10 transition"
                      >
                        <span>View Dossier</span>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!isLoading && filteredApps.length === 0 && (
          <div className="py-12 text-center text-slate-500 dark:text-slate-400 text-xs space-y-3">
            <p>No RTI applications match your filter.</p>
            <Link
              href="/file-rti"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold text-xs shadow hover:bg-purple-500 transition"
            >
              <span>+ File New RTI Petition</span>
            </Link>
          </div>
        )}
      </div>

      {/* Floating Document Preview & Download Modal */}
      <DocumentPreviewModal
        isOpen={previewState.isOpen}
        onClose={() => setPreviewState({ ...previewState, isOpen: false })}
        documentType={previewState.documentType}
        application={previewState.application}
        officialResponse={previewState.application?.officialResponse}
      />
    </div>
  );
}
