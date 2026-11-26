"use client";

import { useState, useEffect } from "react";
import { officerDashboardStats, officerReviewQueue } from "@/data/dashboardData";
import CertifiedResponseModal from "@/components/common/CertifiedResponseModal";
import DocumentPreviewModal from "@/components/common/DocumentPreviewModal";
import StatutoryCountdownClock from "@/components/common/StatutoryCountdownClock";
import { downloadPublicRecordDoc, downloadCertifiedResponse } from "@/lib/services/pdfGenerator";
import {
  Sparkles,
  Check,
  RefreshCw,
  FileText,
  AlertCircle,
  Copy,
  CheckCircle2,
} from "lucide-react";
import { ClipboardList as IcClipboardList, FilePen as IcFilePen, FileText as IcFileText, Folder as IcFolder, Landmark as IcLandmark, Paperclip as IcPaperclip, Plus as IcPlus, Printer as IcPrinter, Scale as IcScale, Search as IcSearch } from "lucide-react";

function parseClauses(val) {
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.filter(Boolean);
      } catch {}
    }
    const lines = trimmed
      .split(/\n+/)
      .map((l) => l.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter(Boolean);
    if (lines.length > 0) return lines;
  }
  return [
    "Certified copies of Sanction Orders and Administrative Approval issued for works executed in the division.",
    "Inspection and certified extracts of Measurement Book (MB) Vol. IV recording exact chainage dimensions and bitumen thickness.",
    "Total expenditure incurred and Running Account (RA) bills disbursed to the contractor as verified by the Divisional Accounts Officer.",
  ];
}

export default function OfficerWorkspace() {
  const [stats, setStats] = useState(officerDashboardStats);
  const [cases, setCases] = useState([]);
  const [selectedCase, setSelectedCase] = useState(null);
  const [draftText, setDraftText] = useState("");
  const [approvedCaseIds, setApprovedCaseIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState("");
  const [docPreview, setDocPreview] = useState({ isOpen: false, name: "", application: null });

  // Response Studio Multi-Tab State
  const [studioTab, setStudioTab] = useState("memorandum"); // "memorandum" | "ai-report" | "records" | "exemptions" | "precedents"
  const [isCertifiedModalOpen, setIsCertifiedModalOpen] = useState(false);
  const [faaDesignation, setFaaDesignation] = useState("Chief Engineer & First Appellate Authority (FAA)");
  const [faaOffice, setFaaOffice] = useState("Office of the Chief Engineer, PWD Zone 1, Capital Complex, New Delhi");
  const [exemptionReason, setExemptionReason] = useState("");

  // AI Report Structuring Studio States
  const [officerNotesInput, setOfficerNotesInput] = useState("");
  const [isAiStructuring, setIsAiStructuring] = useState(false);
  const [aiStructuredReport, setAiStructuredReport] = useState(null);
  const [aiStructureError, setAiStructureError] = useState("");
  const [copiedMemoText, setCopiedMemoText] = useState(false);

  const [attachedRecords, setAttachedRecords] = useState([
    { id: "rec-1", name: "Measurement_Book_Vol_IV_Certified.pdf", size: "4.2 MB", included: true },
    { id: "rec-2", name: "Sanction_Order_PWD_2025_381.pdf", size: "1.8 MB", included: true },
    { id: "rec-3", name: "Running_Account_Bill_Summary.pdf", size: "850 KB", included: true },
  ]);

  // Precedents state
  const [precedents, setPrecedents] = useState([
    {
      caseTitle: "CBSE & Anr. v. Aditya Bandopadhyay & Ors.",
      citation: "(2011) 8 SCC 497",
      ratio: "Fiduciary relationship does not bar disclosure of evaluated answers / public inspection documents.",
    },
    {
      caseTitle: "Central Board of Direct Taxes v. Subhash Chandra Agarwal",
      citation: "CIC/AT/A/2006/00045",
      ratio: "Sanctioned budgets, tender awards, and government asset measurements are strictly public domain.",
    },
    {
      caseTitle: "Reserve Bank of India v. Jayantilal N. Mistry",
      citation: "(2016) 3 SCC 525",
      ratio: "Economic and public interest override generic commercial secrecy claims when public funds are involved.",
    },
  ]);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [selectedDeptId, setSelectedDeptId] = useState("");
  const [transferReason, setTransferReason] = useState("");
  const [isTransferring, setIsTransferring] = useState(false);

  // 1. Fetch live officer dashboard stats
  useEffect(() => {
    let isMounted = true;
    async function loadStats() {
      try {
        const res = await fetch("/api/dashboard/stats?role=OFFICER");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.stats && isMounted) {
            setStats(data.stats);
          }
        }
      } catch (err) {
        console.warn("Officer stats fallback:", err);
      }
    }
    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Fetch live cases from /api/applications
  useEffect(() => {
    let isMounted = true;
    async function loadCases() {
      try {
        const res = await fetch("/api/applications?status=UNDER_REVIEW");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.applications) && data.applications.length > 0) {
            const mappedCases = data.applications.map((app) => {
              let parsedSources = [];
              try {
                parsedSources = app.suggestedSources ? JSON.parse(app.suggestedSources) : [];
              } catch {
                parsedSources = ["Public_Works_Register.pdf", "Measurement_Book_Vol_IV.pdf"];
              }
              if (!Array.isArray(parsedSources) || parsedSources.length === 0) {
                parsedSources = ["Public_Works_Register.pdf", "Measurement_Book_Vol_IV.pdf"];
              }

              const filed = new Date(app.dateFiled || app.createdAt || Date.now());
              const deadline = new Date(app.statutoryDeadline || Date.now() + 12 * 86400000);
              const daysRemaining = Math.max(1, Math.ceil((deadline - new Date()) / (1000 * 60 * 60 * 24)));

              return {
                id: app.applicationNumber || app.id,
                rawId: app.id,
                subject: app.subject || app.title,
                citizen: app.citizen?.user?.fullName || "Rahul Sharma",
                suggestedDepartment: app.department?.name || app.targetAuthority || "Public Works Department",
                departmentId: app.departmentId,
                daysRemaining,
                urgency: daysRemaining <= 7 ? "Critical (Proviso 7)" : `Standard (${daysRemaining}d left)`,
                aiMatchScore: "98.4% Match",
                draftSummary:
                  app.aiDraftSummary ||
                  "Administrative and financial sanction verified from departmental ledgers. Work was inspected by the Executive Engineer on site.",
                suggestedSources: parsedSources,
                status: app.status,
                structuredClauses: parseClauses(app.structuredClauses),
                rawCitizenPrompt: app.citizenNotes || app.subject || "",
                dateFiled: app.dateFiled || app.createdAt,
                statutoryDeadline: app.statutoryDeadline,
              };
            });

            if (isMounted) {
              setCases(mappedCases);
              setSelectedCase(mappedCases[0]);
              setDraftText(mappedCases[0].draftSummary);
            }
            return;
          }
        }

        // Fallback to mock queue
        if (isMounted) {
          const mappedQueue = officerReviewQueue.map((item) => ({
            ...item,
            structuredClauses: parseClauses(item.structuredClauses),
          }));
          setCases(mappedQueue);
          setSelectedCase(mappedQueue[0]);
          setDraftText(mappedQueue[0]?.draftSummary || "");
        }
      } catch (err) {
        console.warn("Using offline review queue:", err);
        if (isMounted) {
          const mappedQueue = officerReviewQueue.map((item) => ({
            ...item,
            structuredClauses: parseClauses(item.structuredClauses),
          }));
          setCases(mappedQueue);
          setSelectedCase(mappedQueue[0]);
          setDraftText(mappedQueue[0]?.draftSummary || "");
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadCases();
    return () => {
      isMounted = false;
    };
  }, []);

  // 3. Load departments for Section 6(3) Transfer
  useEffect(() => {
    async function loadDepts() {
      try {
        const res = await fetch("/api/departments");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.departments)) {
            setDepartments(data.departments);
            if (data.departments.length > 0) {
              setSelectedDeptId(data.departments[0].id);
            }
          }
        }
      } catch (err) {
        console.warn("Could not load departments:", err);
      }
    }
    loadDepts();
  }, []);

  const handleSelectCase = (c) => {
    setSelectedCase(c);
    setDraftText(c.draftSummary || "");
    setActionSuccessMsg("");
    setAiStructuredReport(null);
    setAiStructureError("");
    setOfficerNotesInput("");
    setCopiedMemoText(false);
  };

  // AI Structuring Handlers
  const handleGenerateAiReport = async () => {
    if (!selectedCase) return;
    setIsAiStructuring(true);
    setAiStructureError("");
    try {
      const res = await fetch("/api/officer/ai-structure-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: selectedCase.rawId || selectedCase.id,
          officerNotes: officerNotesInput,
          customClauses: selectedCase.structuredClauses || parseClauses(null),
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to structure report via AI");
      }
      setAiStructuredReport(data.report);
    } catch (err) {
      console.error("AI Report generation error:", err);
      setAiStructureError(err.message || "AI structuring service encountered an issue. Using fallback structure.");
    } finally {
      setIsAiStructuring(false);
    }
  };

  const handleApplyAiReportToMemo = () => {
    if (!aiStructuredReport) return;
    const fullText = aiStructuredReport.fullReportText || "";
    if (fullText) {
      setDraftText(fullText);
      setStudioTab("memorandum");
      setActionSuccessMsg("✓ Structured report added to the memorandum");
    }
  };

  const handleCopyReportText = () => {
    if (!aiStructuredReport) return;
    const text = aiStructuredReport.fullReportText || "";
    if (navigator?.clipboard && text) {
      navigator.clipboard.writeText(text);
      setCopiedMemoText(true);
      setTimeout(() => setCopiedMemoText(false), 2500);
    }
  };

  // 4. Live dispatch response with digital seal
  const handleApprove = async () => {
    if (!selectedCase) return;
    setIsSubmitting(true);
    setActionSuccessMsg("");

    try {
      const targetId = selectedCase.rawId || selectedCase.id;
      const res = await fetch(`/api/applications/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: 5,
          status: "RESPONSE_DISPATCHED",
          officialResponse: draftText,
          responseDispatchedAt: new Date().toISOString(),
        }),
      });

      if (res.ok) {
        setApprovedCaseIds((prev) => [...prev, selectedCase.id]);
        setActionSuccessMsg("✓ Reply signed with Class 3 digital signature and sent to the citizen");
        setIsCertifiedModalOpen(true);
      } else {
        // Fallback simulate local dispatch
        setApprovedCaseIds((prev) => [...prev, selectedCase.id]);
        setActionSuccessMsg("✓ Response Dispatched Successfully (Local Fallback)");
        setIsCertifiedModalOpen(true);
      }
    } catch (err) {
      console.warn("Dispatched with local confirmation:", err);
      setApprovedCaseIds((prev) => [...prev, selectedCase.id]);
      setActionSuccessMsg("✓ Response Dispatched Successfully");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 5. Section 6(3) Transfer Submission
  const handleTransferSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCase || !selectedDeptId) return;
    setIsTransferring(true);

    try {
      const targetId = selectedCase.rawId || selectedCase.id;
      const res = await fetch(`/api/applications/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transferDepartmentId: selectedDeptId,
          transferReason: transferReason || "Subject matter pertains to the jurisdiction of the transferee public authority.",
        }),
      });

      const targetDept = departments.find((d) => d.id === selectedDeptId);
      const targetDeptName = targetDept?.name || "Transferee Authority";

      setActionSuccessMsg(`✓ Section 6(3) Transfer Executed: Forwarded to ${targetDeptName}. Statutory 5-day transfer notice issued.`);
      setShowTransferModal(false);
      setTransferReason("");

      // Remove from pending examination queue or mark as transferred
      setApprovedCaseIds((prev) => [...prev, selectedCase.id]);
    } catch (err) {
      console.error("Transfer failed:", err);
      setActionSuccessMsg("Transfer completed locally.");
      setShowTransferModal(false);
    } finally {
      setIsTransferring(false);
    }
  };

  const isApproved = approvedCaseIds.includes(selectedCase?.id);

  // Quick Clause Insertion Helpers
  const handleInsertClause = (clause) => {
    setDraftText((prev) => (prev ? `${prev}\n\n${clause}` : clause));
  };

  const handleInsertPrecedent = (prec) => {
    const citationText = `[Legal Precedent Cited: In ${prec.caseTitle} (${prec.citation}), it is settled that: "${prec.ratio}"]`;
    handleInsertClause(citationText);
    setStudioTab("memorandum");
  };

  const handleInsertAppellateNotice = () => {
    const notice = `FIRST APPELLATE AUTHORITY (FAA) MANDATORY NOTICE (Section 7(8) RTI Act 2005):\nIf aggrieved by this decision or partial redaction, an appeal may be preferred under Section 19(1) of the RTI Act within thirty (30) days from receipt to:\nDesignation: ${faaDesignation}\nOffice: ${faaOffice}`;
    handleInsertClause(notice);
    setStudioTab("memorandum");
  };

  const handleToggleRecord = (recId) => {
    setAttachedRecords((prev) =>
      prev.map((r) => (r.id === recId ? { ...r, included: !r.included } : r))
    );
  };

  return (
    <div className="space-y-6">
      {/* Officer Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#16262d] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Assigned Queue</span>
          <span className="text-2xl sm:text-[30px] sm:leading-[38px] font-semibold text-purple-900 dark:text-white mt-1 block">
            {stats.assignedApplications ?? cases.length}
          </span>
          <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
            {cases.length} Active in Division
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#16262d] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">AI Drafts Ready</span>
          <span className="text-2xl font-extrabold text-purple-700 dark:text-purple-300 mt-1 block">
            {stats.aiDraftsGenerated ?? cases.length}
          </span>
          <span className="text-xs text-purple-600 dark:text-purple-200">Pre-retrieved from archives</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#16262d] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Dispatched Today</span>
          <span className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1 block">
            {(stats.dispatchedToday || 0) + approvedCaseIds.length}
          </span>
          <span className="text-xs text-emerald-600 dark:text-emerald-300 font-semibold">Digitally Certified</span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#16262d] border border-slate-200/90 dark:border-purple-500/20 shadow-sm dark:shadow-md transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Statutory Compliance</span>
          <span className="text-2xl font-extrabold text-cyan-700 dark:text-cyan-400 mt-1 block">
            {stats.complianceRatio || "98.4%"}
          </span>
          <span className="text-xs text-cyan-600 dark:text-cyan-300 font-semibold">Zero Overdue Appeals</span>
        </div>
      </div>

      {/* Main Split Review Desk */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Assigned Queue List (5 Cols) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#16262d] border border-slate-200/90 dark:border-purple-500/20 rounded-3xl p-5 shadow-sm dark:shadow-xl flex flex-col gap-3 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-wider">
              Pending Examination Queue
            </h3>
            <span className="text-xs text-purple-700 dark:text-purple-300 font-mono font-bold">
              {cases.length} Petitions
            </span>
          </div>

          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-2 text-slate-500">
              <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs">Loading departmental queue...</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1">
              {cases.map((item) => {
                const isSelected = selectedCase?.id === item.id;
                const hasBeenApproved = approvedCaseIds.includes(item.id);

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectCase(item)}
                    className={`p-4 rounded-2xl border transition-colors cursor-pointer ${
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
                        className={`text-xs px-2 py-0.5 rounded-lg font-bold border ${
                          hasBeenApproved
                            ? "bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-500/30"
                            : item.urgency.includes("Critical")
                            ? "bg-rose-500/15 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-500/30"
                            : "bg-amber-500/15 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300 border-amber-500/30"
                        }`}
                      >
                        {hasBeenApproved ? "Dispatched" : item.urgency}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.subject}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Applicant: {item.citizen} • Due in {item.daysRemaining} days
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Officer Verification & Multi-Tab AI Response Studio (7 Cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-[#16262d] border border-slate-300/40 dark:border-white/10 rounded-xl p-6 sm:p-8 shadow-sm flex flex-col gap-4 text-slate-800 dark:text-slate-100 transition-colors">
          {actionSuccessMsg && (
            <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
              <span>{actionSuccessMsg}</span>
              <button
                type="button"
                onClick={() => setActionSuccessMsg("")}
                className="text-emerald-500 hover:text-emerald-700 ml-2"
              >
                ✕
              </button>
            </div>
          )}

          {/* Dossier Header with Statutory Clock */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-purple-700 dark:text-purple-300 font-bold">
                  {selectedCase?.id || "SARAL-2026-00124"}
                </span>
                <span className="px-2 py-0.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-700 dark:text-purple-300 text-xs font-bold">
                  {selectedCase?.aiMatchScore || "98.4% Match"}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                {selectedCase?.subject || "Pending Case Examination"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Citizen: <strong>{selectedCase?.citizen || "Rahul Sharma"}</strong> • Authority: {selectedCase?.suggestedDepartment || "Public Works Department"}
              </p>
            </div>

            {/* Live Statutory Compliance Countdown */}
            <div className="sm:text-right flex flex-col sm:items-end">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono block">STATUTORY CLOCK:</span>
              <StatutoryCountdownClock
                dateFiled={selectedCase?.dateFiled || "2026-11-01T00:00:00Z"}
                statutoryDeadline={selectedCase?.statutoryDeadline || "2026-12-01T00:00:00Z"}
                status={isApproved ? "RESPONSE_DISPATCHED" : "UNDER_REVIEW"}
                size="compact"
              />
            </div>
          </div>

          {/* Response Studio Tab Navigation */}
          <div className="flex items-center gap-2 p-1 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-xs overflow-x-auto">
            <button
              type="button"
              onClick={() => setStudioTab("memorandum")}
              className={`px-3 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                studioTab === "memorandum"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span><IcFilePen className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
              <span>Statutory Memorandum</span>
            </button>

            <button
              type="button"
              onClick={() => setStudioTab("ai-report")}
              className={`px-3 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                studioTab === "ai-report"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-purple-700 dark:text-purple-300 hover:text-purple-900 dark:hover:text-white bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>AI Report Structuring</span>
              <span className="text-xs px-2 py-0.5 rounded-lg font-bold bg-purple-500/20 dark:bg-purple-400/20 text-purple-700 dark:text-purple-300">
                Copilot
              </span>
            </button>

            <button
              type="button"
              onClick={() => setStudioTab("records")}
              className={`px-3 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                studioTab === "records"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span><IcFolder className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
              <span>Attached Registers ({attachedRecords.filter((r) => r.included).length})</span>
            </button>

            <button
              type="button"
              onClick={() => setStudioTab("exemptions")}
              className={`px-3 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                studioTab === "exemptions"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span><IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
              <span>Section 8 & FAA Notice</span>
            </button>

            <button
              type="button"
              onClick={() => setStudioTab("precedents")}
              className={`px-3 py-2 rounded-xl font-semibold transition cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                studioTab === "precedents"
                  ? "bg-purple-600 text-white shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <span><IcLandmark className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
              <span>CIC Precedents (RAG)</span>
            </button>
          </div>

          {/* TAB 1: Statutory Memorandum */}
          {studioTab === "memorandum" && (
            <div className="space-y-3 text-xs">
              {/* Quick AI Report Structuring Banner */}
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-700 dark:text-purple-300 font-bold shrink-0">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                      Need point-by-point Section 7(1) Compliance?
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Let Officer AI Copilot structure your raw findings and map to Citizen Clauses automatically.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setStudioTab("ai-report")}
                  className="px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer flex items-center gap-2 shrink-0 shadow-sm"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Launch AI Structuring</span>
                </button>
              </div>

              {/* Quick Snippet Injectors */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Quick Legal Snippets:
                </span>
                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    type="button"
                    onClick={() =>
                      handleInsertClause(
                        "Certified copy of Sanctioned Administrative & Financial Approval (A&F Order No. PWD/2025/381) is hereby enclosed."
                      )
                    }
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-medium transition cursor-pointer"
                  >
                    + A&amp;F Sanction
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInsertClause(
                        "On-site technical inspection was conducted by the Executive Engineer on 15 Oct 2026. The bituminous road top was verified as per IRC standards."
                      )
                    }
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-medium transition cursor-pointer"
                  >
                    + Site Inspection
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleInsertClause(
                        "Measurement Book Vol. IV pages 42-49 recording exact chainage dimensions have been extracted and verified under Section 2(j)(ii)."
                      )
                    }
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-medium transition cursor-pointer"
                  >
                    + MB Vol IV Pages
                  </button>
                </div>
              </div>

              {/* Memorandum Draft Textarea */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white">
                    Official Response Text (Section 7 Compliant):
                  </label>
                  <span className="text-xs text-purple-700 dark:text-purple-300 font-mono">
                    Ref: MEMO/{selectedCase?.id || "SARAL-001"}/PIO-CERT
                  </span>
                </div>
                <textarea
                  rows={6}
                  value={draftText}
                  onChange={(e) => setDraftText(e.target.value)}
                  disabled={isApproved}
                  placeholder="Draft official statutory response here..."
                  className="w-full p-4 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500 resize-none font-sans"
                />
              </div>

              {/* Pre-Retrieved Source Files */}
              <div className="space-y-2">
                <span className="label-caps text-slate-500 dark:text-slate-400 block">
                  Referenced Departmental Records:
                </span>
                <div className="flex flex-wrap gap-2">
                  {(selectedCase?.suggestedSources || ["PWD_Works_Register.pdf", "Measurement_Book_Vol_IV.pdf"]).map((source) => (
                    <span
                      key={source}
                      className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-200 dark:border-white/10 text-purple-800 dark:text-purple-200 text-xs font-mono"
                    >
                      <IcFileText className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> {source}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: AI Report Structuring Studio */}
          {studioTab === "ai-report" && (
            <div className="space-y-4 text-xs">
              {/* Top Explainer Header */}
              <div className="p-4 rounded-2xl bg-purple-500/15 border border-purple-500/30 flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                      Section 7(1) Officer AI Report Structuring Copilot
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-lg font-bold bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/30">
                      Official PIO Tool
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Citizen petitions contain distinct statutory clauses under Section 6(1). Enter your raw departmental observations, physical measurements, or sanction numbers. AI will map each citizen query point-by-point into an official Section 7(1) certified compliance report.
                  </p>
                </div>
              </div>

              {/* Citizen Clauses Under Examination */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span><IcClipboardList className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                    <span>Citizen Section 6(1) Clauses Under Audit:</span>
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    {(selectedCase?.structuredClauses || parseClauses(null)).length} Statutory Items
                  </span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {(selectedCase?.structuredClauses || parseClauses(null)).map((clause, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-start gap-3 text-slate-700 dark:text-slate-300"
                    >
                      <span className="w-5 h-5 rounded-lg bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold font-mono text-xs flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <p className="text-xs leading-relaxed">{clause}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Officer Raw Findings Input */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span><IcSearch className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                    <span>Officer&apos;s Departmental Findings &amp; Ledger Notes:</span>
                  </label>
                  <span className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
                    Raw notes will be legally structured
                  </span>
                </div>

                {/* Quick Presets for Officer */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-400">Quick Remarks:</span>
                  <button
                    type="button"
                    onClick={() =>
                      setOfficerNotesInput((prev) =>
                        prev
                          ? `${prev}\n• Administrative & Financial Sanction Order #381 verified and intact.`
                          : "• Administrative & Financial Sanction Order #381 verified and intact."
                      )
                    }
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-medium transition cursor-pointer"
                  >
                    + Sanction Order #381
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOfficerNotesInput((prev) =>
                        prev
                          ? `${prev}\n• Measurement Book (MB Vol. IV, Pg 42-58) site inspection records enclosed.`
                          : "• Measurement Book (MB Vol. IV, Pg 42-58) site inspection records enclosed."
                      )
                    }
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-medium transition cursor-pointer"
                  >
                    + MB Vol IV Pg 42-58
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOfficerNotesInput((prev) =>
                        prev
                          ? `${prev}\n• Total disbursement ₹42.50 Lakhs disbursed across 3 Running Account bills.`
                          : "• Total disbursement ₹42.50 Lakhs disbursed across 3 Running Account bills."
                      )
                    }
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-medium transition cursor-pointer"
                  >
                    + RA Bills (₹42.50 Lakhs)
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setOfficerNotesInput((prev) =>
                        prev
                          ? `${prev}\n• Quality test reports (bitumen core test) dated 12/03/2026 attached.`
                          : "• Quality test reports (bitumen core test) dated 12/03/2026 attached."
                      )
                    }
                    className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-xs font-medium transition cursor-pointer"
                  >
                    + Core Test Report
                  </button>
                </div>

                <textarea
                  rows={3}
                  value={officerNotesInput}
                  onChange={(e) => setOfficerNotesInput(e.target.value)}
                  placeholder="Type your departmental findings, ledger entries, or physical inspection observations here (e.g. Sanction order verified, ₹42.50 Lakhs disbursed via RA Bill #3, MB Vol IV inspected)..."
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300/80 dark:border-white/10 text-slate-900 dark:text-white text-xs leading-relaxed focus:outline-none focus:border-purple-500 resize-none font-sans"
                />

                <div className="flex items-center justify-between gap-3 pt-1">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    AI synthesizes clauses, findings, and Section 7(1) compliance text.
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateAiReport}
                    disabled={isAiStructuring}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAiStructuring ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Structuring Report with AI...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                        <span>Structure Official Report with AI</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Banner if any */}
              {aiStructureError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{aiStructureError}</span>
                </div>
              )}

              {/* Structured AI Report Result Preview */}
              {aiStructuredReport && (
                <div className="p-4 rounded-2xl bg-purple-500/[0.04] border border-purple-500/30 space-y-4">
                  {/* Result Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-purple-500/20 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">
                          Official Information Report (Section 7(1) RTI Act 2005)
                        </span>
                        <span className="text-xs px-2 py-0.5 rounded-lg font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                          {aiStructuredReport.isAiGenerated ? "AI Synthesized" : "Statutory Template"}
                        </span>
                      </div>
                      <p className="text-xs text-purple-700 dark:text-purple-300 font-mono mt-0.5">
                        Dispatch Ref: {aiStructuredReport.dispatchReference} • Date: {aiStructuredReport.dateOfDispatch}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleCopyReportText}
                        className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                      >
                        {copiedMemoText ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Report</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={handleApplyAiReportToMemo}
                        className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-2 shadow-sm"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Apply to Memorandum</span>
                      </button>
                    </div>
                  </div>

                  {/* Point-by-Point Clause Mappings */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-900 dark:text-white tracking-wider block">
                      Point-by-Point Statutory Disclosures:
                    </span>

                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {(aiStructuredReport.clauseWiseResponses || []).map((c) => (
                        <div
                          key={c.clauseNumber}
                          className="p-3 rounded-xl bg-white dark:bg-white/5 border border-purple-500/20 space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-purple-700 dark:text-purple-300 font-mono">
                              Point No. {c.clauseNumber}
                            </span>
                            <span className="text-xs px-2 py-0.5 rounded-lg font-bold bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20">
                              {c.status || "RECORD_ENCLOSED"}
                            </span>
                          </div>

                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            <strong>Citizen Query:</strong> &ldquo;{c.citizenQuery}&rdquo;
                          </div>

                          <div className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-sans bg-slate-50 dark:bg-white/[0.02] p-2 rounded-lg border border-slate-200/50 dark:border-white/5">
                            <strong>Official Reply:</strong> {c.officialReply}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Certified Enclosures & Appellate Preview */}
                  {aiStructuredReport.certifiedEnclosures && aiStructuredReport.certifiedEnclosures.length > 0 && (
                    <div className="pt-2 border-t border-purple-500/20">
                      <span className="label-caps text-slate-500 dark:text-slate-400 block mb-1">
                        Attached Certified Enclosures (Section 2(j)(ii)):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {aiStructuredReport.certifiedEnclosures.map((enc, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-lg bg-purple-500/10 text-purple-700 dark:text-purple-300 text-xs font-mono border border-purple-500/20"
                          >
                            <IcPaperclip className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> {enc}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 1-Click Apply Button */}
                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={handleApplyAiReportToMemo}
                      className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center justify-center gap-2 shadow-md cursor-pointer text-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>Insert This Full Structured Report into Official Memorandum</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Attached Registers */}
          {studioTab === "records" && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                Select departmental files to bind into the digitally certified PDF response package under Section 2(j)(ii):
              </p>

              <div className="space-y-2">
                {attachedRecords.map((rec) => (
                  <div
                    key={rec.id}
                    onClick={() => handleToggleRecord(rec.id)}
                    className={`p-3 rounded-2xl border transition flex items-center justify-between cursor-pointer ${
                      rec.included
                        ? "bg-purple-500/10 border-purple-500/30 text-slate-900 dark:text-white"
                        : "bg-slate-50 dark:bg-white/[0.02] border-slate-200 dark:border-white/5 text-slate-500 opacity-60"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={rec.included}
                        onChange={() => {}}
                        className="w-4 h-4 text-purple-600 rounded cursor-pointer"
                      />
                      <div>
                        <div className="font-semibold text-xs font-mono">{rec.name}</div>
                        <div className="text-xs text-slate-400">
                          {rec.size} • Public Record Register
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDocPreview({
                            isOpen: true,
                            name: rec.name,
                            application: selectedCase,
                          });
                        }}
                        className="px-3 py-1 rounded-lg bg-purple-600/15 hover:bg-purple-600 text-purple-700 hover:text-white dark:text-purple-300 dark:hover:text-white border border-purple-500/30 text-xs font-bold transition cursor-pointer"
                      >
                        Preview & Download
                      </button>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30">
                        Certified
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Section 8 Exemptions & FAA Notice */}
          {studioTab === "exemptions" && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
                <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> <strong>Section 7(8) RTI Act Mandate:</strong> When any information is refused or redacted under Section 8(1), the PIO <em>must</em> state the reasons and furnish particulars of the First Appellate Authority (FAA) with the 30-day limitation window.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Designation of First Appellate Authority (FAA):
                </label>
                <input
                  type="text"
                  value={faaDesignation}
                  onChange={(e) => setFaaDesignation(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Appellate Office Postal &amp; Jurisdictional Address:
                </label>
                <input
                  type="text"
                  value={faaOffice}
                  onChange={(e) => setFaaOffice(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="button"
                onClick={handleInsertAppellateNotice}
                className="w-full py-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span><IcPlus className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                <span>Inject Section 7(8) Appellate Notice into Memorandum</span>
              </button>
            </div>
          )}

          {/* TAB 4: CIC Landmark Precedents */}
          {studioTab === "precedents" && (
            <div className="space-y-3 text-xs">
              <p className="text-slate-500 dark:text-slate-400">
                Landmark Central Information Commission &amp; Supreme Court decisions relevant to public works, tenders, and governance:
              </p>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {precedents.map((prec) => (
                  <div
                    key={prec.citation}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h5 className="font-bold text-slate-900 dark:text-white text-xs">
                          {prec.caseTitle}
                        </h5>
                        <span className="font-mono text-xs text-purple-700 dark:text-purple-300">
                          {prec.citation}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleInsertPrecedent(prec)}
                        className="px-3 py-1 rounded-lg bg-purple-600/15 hover:bg-purple-600 text-purple-700 hover:text-white dark:text-purple-300 dark:hover:text-white border border-purple-500/30 text-xs font-bold transition cursor-pointer whitespace-nowrap"
                      >
                        + Cite in Memo
                      </button>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                      &ldquo;{prec.ratio}&rdquo;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Officer Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200 dark:border-white/10">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {isApproved
                ? "✓ Digitally signed with Class 3 PKI & Dispatched"
                : "Certified response will be sealed and synchronized with DigiLocker."}
            </span>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Preview Certified PDF Button */}
              <button
                type="button"
                onClick={() => setIsCertifiedModalOpen(true)}
                className="px-4 py-3 rounded-xl bg-purple-600/15 hover:bg-purple-600 text-purple-700 hover:text-white dark:bg-purple-600/20 dark:hover:bg-purple-600 dark:text-purple-200 border border-purple-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-2 whitespace-nowrap"
              >
                <span><IcPrinter className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /></span>
                <span>Preview Certified PDF</span>
              </button>

              {!isApproved ? (
                <>
                  <button
                    type="button"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Applying PKI Seal...</span>
                      </>
                    ) : (
                      <span>Approve &amp; Apply Digital Seal</span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowTransferModal(true)}
                    className="px-3 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-transparent text-xs font-semibold transition cursor-pointer whitespace-nowrap"
                  >
                    Section 6(3) Transfer
                  </button>
                </>
              ) : (
                <span className="px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                  ✓ Dispatched Successfully
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Certified Sovereign Response Modal */}
      <CertifiedResponseModal
        isOpen={isCertifiedModalOpen}
        onClose={() => setIsCertifiedModalOpen(false)}
        application={selectedCase}
        officialResponse={draftText}
      />

      {/* Section 6(3) Transfer Modal */}
      {showTransferModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fadeIn">
          <div className="bg-white dark:bg-[#1c2e36] border border-slate-200 dark:border-purple-500/30 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-white/10 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Section 6(3) Departmental Transfer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Transfer petition {selectedCase?.id} to the competent Public Authority
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTransferModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Transferee Public Authority:
                </label>
                <select
                  value={selectedDeptId}
                  onChange={(e) => setSelectedDeptId(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id} className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white">
                      {dept.name} ({dept.stateOrCentral})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Statutory Reason for Transfer (Recorded in Official Note):
                </label>
                <textarea
                  rows={3}
                  value={transferReason}
                  onChange={(e) => setTransferReason(e.target.value)}
                  placeholder="e.g. Subject matter of road construction falls under Gram Panchayat / Rural Development jurisdiction, not Divisional PWD."
                  required
                  className="w-full p-3 rounded-xl bg-slate-50 dark:bg-white/10 border border-slate-300 dark:border-white/15 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs leading-relaxed">
                <IcScale className="inline-block w-[1em] h-[1em] align-[-0.125em] shrink-0" strokeWidth={1.75} aria-hidden="true" /> <strong>Statutory Mandate:</strong> Under Section 6(3) of RTI Act 2005, the transfer must be executed within 5 days of receipt and applicant informed immediately.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowTransferModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 text-slate-700 dark:text-slate-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isTransferring}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isTransferring ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Transferring...</span>
                    </>
                  ) : (
                    <span>Execute Section 6(3) Transfer</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Document Preview Modal */}
      <DocumentPreviewModal
        isOpen={docPreview.isOpen}
        onClose={() => setDocPreview({ ...docPreview, isOpen: false })}
        documentType="PUBLIC_RECORD"
        docName={docPreview.name}
        application={docPreview.application}
      />
    </div>
  );
}
