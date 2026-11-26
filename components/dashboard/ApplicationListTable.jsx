"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { mockRtiApplications } from "@/data/trackingData";
import StatutoryCountdownClock from "@/components/common/StatutoryCountdownClock";
import { FolderOpen as IcFolderOpen, ArrowRight as IcArrowRight } from "lucide-react";
import DocumentPreviewModal from "@/components/common/DocumentPreviewModal";

function formatDeterministicDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  if (isNaN(d.getTime())) return String(val);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const day = String(d.getDate()).padStart(2, "0");
  const month = months[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

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
        classes: "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/15 dark:text-cyan-300 border-cyan-200 dark:border-cyan-500/30",
      };
      if (isResolved) {
        statusBadge = {
          label: "Certified Response Ready",
          classes: "bg-[#eaefea] text-[#2a473e] dark:bg-emerald-500/15 dark:text-emerald-300 border-[#c2d6c5] dark:border-emerald-500/30",
        };
      } else if (isAppeal) {
        statusBadge = {
          label: "Section 19 Appeal Active",
          classes: "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-500/30",
        };
      }

      const formattedDate = formatDeterministicDate(filedDate);

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
    <div className="w-full bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 rounded-xl shadow-sm flex flex-col overflow-hidden text-slate-800 dark:text-slate-100 transition-colors">
      {/* Top Filter and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 px-6 py-6">
        <div>
          <h3 className="text-xl sm:text-2xl leading-8 font-semibold text-purple-900 dark:text-white flex items-center gap-2">
            <span>My Filed RTI Applications</span>
            <span className="min-w-6 h-6 px-1.5 rounded-full bg-slate-100 dark:bg-white/10 text-purple-900 dark:text-purple-200 font-sans text-xs font-semibold inline-flex items-center justify-center">
              {filteredApps.length}
            </span>
          </h3>
          <p className="text-[13px] leading-5 text-slate-600 dark:text-slate-400 mt-1">
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
              className="pl-9 pr-3 py-2.5 rounded-md bg-slate-50 dark:bg-white/10 border border-slate-300/50 dark:border-white/15 text-sm text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 w-full sm:w-72"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-50 dark:bg-white/5 p-1 rounded-md border border-slate-300/40 dark:border-white/10 text-sm">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                filter === "all"
                  ? "bg-purple-900 text-white dark:bg-white dark:text-purple-900 font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setFilter("in_review")}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                filter === "in_review"
                  ? "bg-purple-900 text-white dark:bg-white dark:text-purple-900 font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              In Review
            </button>
            <button
              type="button"
              onClick={() => setFilter("completed")}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                filter === "completed"
                  ? "bg-purple-900 text-white dark:bg-white dark:text-purple-900 font-semibold shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Resolved
            </button>
            <button
              type="button"
              onClick={() => setFilter("appeal_open")}
              className={`px-3 py-1.5 rounded-sm font-medium transition-colors cursor-pointer ${
                filter === "appeal_open"
                  ? "bg-purple-900 text-white dark:bg-white dark:text-purple-900 font-semibold shadow-sm"
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
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="bg-[#eaf5fd] dark:bg-white/5 border-y border-slate-300/40 dark:border-white/10 text-slate-600 dark:text-slate-400 [&>th]:py-4 [&>th:first-child]:pl-6 [&>th:last-child]:pr-6">
                <th className="label-caps">Reference ID</th>
                <th className="label-caps">Subject &amp; Authority</th>
                <th className="label-caps">Date Filed</th>
                <th className="label-caps">Statutory Clock</th>
                <th className="label-caps">Current Status</th>
                <th className="label-caps text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/70 dark:divide-white/5">
              {filteredApps.map((app) => (
                <tr key={app.id || app.idStr} className="hover:bg-slate-50/80 dark:hover:bg-white/[0.02] transition">
                  <td className="py-4 pl-6 pr-3 font-mono font-semibold text-purple-900 dark:text-purple-200">
                    {app.idStr}
                  </td>

                  <td className="py-4 pr-3">
                    <div className="font-semibold text-slate-900 dark:text-white max-w-xs truncate">
                      {app.title}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {app.deptName}
                    </div>
                  </td>

                  <td className="py-4 pr-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <span suppressHydrationWarning>{app.formattedDate}</span>
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
                      className={`label-caps px-2.5 py-1 rounded-sm border ${app.statusBadge.classes}`}
                    >
                      {app.statusBadge.label}
                    </span>
                  </td>

                  <td className="py-4 pr-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 justify-end flex-wrap">
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
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-white hover:bg-slate-100 text-purple-900 dark:bg-white/5 dark:hover:bg-white/10 dark:text-purple-200 border border-slate-300/60 dark:border-white/15 text-xs font-semibold transition cursor-pointer"
                        title="View & Download Official Receipt"
                      >
                        <span>Receipt</span>
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
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-[#eaefea] hover:bg-[#dbe6dc] text-[#2a473e] dark:bg-emerald-600/20 dark:text-emerald-300 border border-[#c2d6c5] dark:border-emerald-500/30 text-xs font-semibold transition cursor-pointer"
                        >
                          <span>Certified PDF</span>
                        </button>
                      )}

                      {app.isAppeal && (
                        <Link
                          href={`/appeal?id=${app.idStr}`}
                          className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-cyan-700 hover:bg-cyan-800 text-white border border-cyan-700 text-xs font-semibold transition"
                        >
                          <span>File Appeal</span>
                        </Link>
                      )}

                      <Link
                        href={`/tracking?id=${app.idStr}`}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-md bg-purple-900 hover:bg-purple-700 dark:bg-white/10 dark:hover:bg-white/15 text-white text-xs font-semibold border border-purple-900 dark:border-white/10 transition"
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
          <div className="py-16 px-6 flex flex-col items-center text-center text-slate-600 dark:text-slate-400 gap-4">
            <span className="w-16 h-16 rounded-xl bg-[#eaf5fd] dark:bg-white/5 flex items-center justify-center text-purple-900 dark:text-purple-200">
              <IcFolderOpen className="w-7 h-7" strokeWidth={1.75} aria-hidden="true" />
            </span>
            <p className="font-display text-xl sm:text-2xl font-semibold text-purple-900 dark:text-white">No RTI applications match your filter</p>
            <Link
              href="/file-rti"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-purple-900 text-white dark:bg-white dark:text-purple-900 font-semibold text-sm sm:text-base shadow-sm hover:bg-purple-700 transition-colors"
            >
              <span>File New RTI Petition</span>
              <IcArrowRight className="w-4 h-4" strokeWidth={2} aria-hidden="true" />
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
